import { Server } from 'socket.io';

import { getUserByName } from '../service/userService';
import { saveSubmit } from '../service/submitService';
import { gradingWithWorker } from '../service/debugService';
import { ProblemCodeModel } from './mongoConfig';

const getTestCode = async problemId => {
  const problemCodeData = await ProblemCodeModel.findOne({ _id: problemId });
  return problemCodeData.testCode;
};

const parallelGrading = async ({ socket, id, code, testCode }) => {
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

  return results;
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

    socket.on('test', async ({ code, id, problemId }) => {
      const testCode = await getTestCode(problemId);

      const results = await parallelGrading({ socket, id, code, testCode });

      socket.emit('loadTestSuccess', results);
    });

    socket.on('submit', async ({ code, id, problemId }) => {
      if (!user) {
        socket.disconnect();
      }

      const testCode = await getTestCode(problemId);

      const results = await parallelGrading({ socket, id, code, testCode });

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
