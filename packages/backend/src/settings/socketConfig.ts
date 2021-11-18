/* eslint-disable prefer-destructuring */
import fs from 'fs';
import path from 'path';

import { Server } from 'socket.io';
import * as workerpool from 'workerpool';
import { debug } from '../service/debugService';
import { ProblemCodeModel } from './mongoConfig';

/* eslint-disable-next-line @typescript-eslint/no-var-requires */
const chaiPath = path.dirname(require.resolve('chai'));
const chaiString = fs.readFileSync(path.join(chaiPath, 'chai.js')).toString();

const gradingWithWorkerpool = ({ pool, socket, code, testCode }) => {
  pool
    .exec(debug.runner, [{ chaiString, code, testCode }])
    .timeout(5000)
    .then(result => {
      socket.emit('result', result);
    })
    .catch(err => {
      socket.emit('error', err);
    });
};

const getTestCode = async problemId => {
  const problemCodeData = await ProblemCodeModel.findOne({ _id: problemId });
  return problemCodeData.testCode;
};

export const socketConnection = httpServer => {
  const pool = workerpool.pool({ maxWorkers: 5 });

  const io = new Server(httpServer, {
    cors: { origin: process.env.ORIGIN_URL },
  });

  io.on('connection', socket => {
    socket.on('submit', async ({ code, id }) => {
      const testCode = await getTestCode(id);
      gradingWithWorkerpool({ pool, socket, code, testCode: [...testCode] });
    });

    socket.once('forceDisconnect', () => {
      socket.disconnect(true);
    });
  });
};
