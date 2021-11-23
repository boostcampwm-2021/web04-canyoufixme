/* eslint-disable no-return-await */
/* eslint-disable prefer-destructuring */
import fs from 'fs';
import path from 'path';

import { Server } from 'socket.io';
import * as workerpool from 'workerpool';
import { debug } from '../service/debugService';
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

/* eslint-disable-next-line @typescript-eslint/no-var-requires */
const chaiPath = path.dirname(require.resolve('chai'));
const chaiString = fs.readFileSync(path.join(chaiPath, 'chai.js')).toString();

const gradingWithWorkerpool = async ({ id, pool, socket, code, testCode }) => {
  try {
    await pool
      .exec(debug.runner, [{ chaiString, code, testCode }])
      .timeout(5000);

    socket.emit('testSuccess', {
      id,
      resultCode: ResultCode.success,
    });
  } catch (e) {
    switch (true) {
      case e instanceof workerpool.Promise.TimeoutError:
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
  const pool = workerpool.pool({ maxWorkers: 16 });

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
            pool,
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
