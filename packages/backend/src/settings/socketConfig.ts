/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable prefer-destructuring */
import { Server } from 'socket.io';
import * as workerpool from 'workerpool';
import { debug } from '../service/debugService';
import { ProblemCodeModel } from './mongoConfig';

const chaiString = require('fs')
  .readFileSync(`../../node_modules/chai/chai.js`)
  .toString();

const gradingWithWorkerpool = ({ pool, socket, code, testCode }) => {
  pool
    .exec(debug.runner, [{ chaiString, code, testCode }])
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
  const pool = workerpool.pool();

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