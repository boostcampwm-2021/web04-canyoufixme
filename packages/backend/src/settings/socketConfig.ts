import { randomBytes } from 'crypto';
import { Worker } from 'worker_threads';
import { Server } from 'socket.io';

import { getUserByName } from '../service/userService';
import { saveSubmit } from '../service/submitService';
import { ProblemCodeModel } from './mongoConfig';

// TODO: 공통파일로 분리
// eslint-disable-next-line no-shadow
enum ResultCode {
  'success',
  'fail',
  'timeout',
  'pending',
}

interface ITestFailed {
  type: 'fail';
  payload: { message: string };
}
class TimeoutError extends Error {}
const SEC = 1000;
const TIMEOUT = 5;

const gradingWithWorkerpool = async ({ id, socket, code, testCode }) => {
  const returnVerifyKey = randomBytes(256).toString('hex');
  const workerCode = `
    const { parentPort } = require('worker_threads');
    parentPort.on('message', input => {
      const { NodeVM, VMScript } = require('vm2');

      const { expect } = require('chai');

      const vm = new NodeVM({
        console: 'inherit',
        sandbox: {},
        require: {
          context: 'sandbox',
          mock: {
            module: {
              require: undefined,
            }
          }
        },
        wrapper: 'none',
      });
      vm.freeze(expect, 'expect');

      const script = new VMScript(
        "require = undefined;" +
        "module = undefined;" +
        "delete global.Buffer;" +
        "delete global.process;" +
        input +
        "\\n return '${returnVerifyKey}';",
        { filename: 'vm.js' }
      );
      try {
        const key = vm.run(script);
        if ('${returnVerifyKey}' !== key) {
          throw new SyntaxError('Illegal return statement');
        }
        parentPort.postMessage({
          type: 'success'
        });
      } catch (e) {
        parentPort.postMessage({
          type: 'fail',
          payload: {
            message: e.message
          }
        });
      }
    });
  `;
  const worker = new Worker(workerCode, { eval: true });
  try {
    worker.postMessage(`
      ${code};
      ${testCode};
    `);

    const result = await new Promise<ITestFailed>((resolve, reject) => {
      worker.on('message', resolve);
      setTimeout(() => {
        reject(new TimeoutError(`timeout ${TIMEOUT}s`));
      }, TIMEOUT * SEC);
    });

    if (result.type === 'fail') {
      throw new Error(result.payload.message);
    }
    socket.emit('testSuccess', {
      id,
      resultCode: ResultCode.success,
    });
  } catch (e) {
    switch (true) {
      case e instanceof TimeoutError:
        socket.emit('testFail', {
          id,
          message: e.message,
          resultCode: ResultCode.timeout,
        });
        break;
      default:
        socket.emit('testFail', {
          id,
          message: e.message,
          resultCode: ResultCode.fail,
        });
        break;
    }
  }
};

const getTestCode = async problemId => {
  const problemCodeData = await ProblemCodeModel.findOne({ _id: problemId });
  return problemCodeData.testCode;
};

export const socketConnection = (httpServer, sessionConfig) => {
  const io = new Server(httpServer, {
    cors: { origin: process.env.ORIGIN_URL, credentials: true },
  });

  io.use((socket, next) => {
    sessionConfig(socket.request, {}, next);
  });

  io.on('connection', async socket => {
    const session = (socket.request as unknown as { session: unknown })
      ?.session;
    const user = await getUserByName((session as { name: unknown })?.name);

    if (!user) {
      socket.disconnect();
    }
    socket.on('submit', async ({ code, id, problemId }) => {
      const testCode = await getTestCode(problemId);

      const results = await Promise.all(
        testCode.map(async (test, idx) => {
          const result = await gradingWithWorkerpool({
            id: id[idx],
            socket,
            code,
            testCode: test,
          });
          return result;
        }),
      );

      await saveSubmit({
        user,
        problemCodeId: problemId,
        code,
        testResult: results,
      });
    });

    socket.once('forceDisconnect', () => {
      socket.disconnect(true);
    });
  });
};
