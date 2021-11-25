import { Server } from 'socket.io';

import { getUserByName } from '../service/userService';
import { saveSubmit } from '../service/submitService';
import { gradingWithWorker } from '../service/debugService';
import { ProblemCodeModel } from './mongoConfig';

const getTestCode = async problemId => {
  const problemCodeData = await ProblemCodeModel.findOne({ _id: problemId });
  return problemCodeData.testCode;
};

export const socketConnection = (httpServer, sessionConfig) => {
  const io = new Server(httpServer, {
    cors: {
      methods: ['GET', 'POST'],
      origin: process.env.ORIGIN_URL,
      credentials: true,
    },
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
          const result = await gradingWithWorker({
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
