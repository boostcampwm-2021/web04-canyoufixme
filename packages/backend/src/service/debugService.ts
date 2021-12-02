import { Worker } from 'worker_threads';
import { ResultCode } from '@cyfm/types';
import type { ITestResult } from '@cyfm/types';
import { SEC, TIMEOUT } from '../util/constant';

class TimeoutError extends Error {
  constructor(message) {
    super(message);
    this.name = 'TimeoutError';
  }
}

export const gradingWithWorker = async ({ id, socket, code, testCode }) => {
  let worker;
  let result: ITestResult;
  try {
    const workerCode = `
      const { parentPort } = require('worker_threads');
      parentPort.on('message', ({ code, testCode }) => {
        const { VM } = require('vm2');

        const { expect } = require('chai');
        const sinon = require('sinon');
        const sandbox = sinon.createSandbox({
          useFakeTimers: true,
        });
        const clock = sandbox.clock;

        const vm = new VM({
          timeout: 1000,
          sandbox: {
            setTimeout: clock.setTimeout,
            clearTimeout: clock.clearTimeout,
            setInterval: clock.setInterval,
            clearInterval: clock.clearInterval,
          },
        })

        try {
          vm.run(code);

          vm.freeze(expect, 'expect');
          vm.freeze(clock, 'clock');
          vm.run(testCode);
          clock.runAll();

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

    worker = new Worker(workerCode, {
      eval: true,
      argv: [],
      env: {},
    });

    worker.postMessage({
      code,
      testCode,
    });

    result = await new Promise<ITestResult>((resolve, reject) => {
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
  } finally {
    worker.terminate();
    return result.type
  }
};
