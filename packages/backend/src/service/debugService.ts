import { randomBytes } from 'crypto';
import { Worker } from 'worker_threads';

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

class TimeoutError extends Error {
  constructor(message) {
    super(message);
    this.name = 'TimeoutError';
  }
}
const SEC = 1000;
const TIMEOUT = 5;

const generateRandomKey = () => randomBytes(256).toString('hex');

export const gradingWithWorker = async ({ id, socket, code, testCode }) => {
  try {
    const returnVerifyKey = generateRandomKey();
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

    const worker = new Worker(workerCode, {
      eval: true,
      argv: [],
      env: {},
    });

    worker.postMessage(`
      ${code};
      ${testCode};
    `);

    const result = await new Promise<ITestFailed>((resolve, reject) => {
      worker.on('message', resolve);
      setTimeout(() => {
        worker.terminate();
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
    switch (e.name) {
      case 'TimeoutError':
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
