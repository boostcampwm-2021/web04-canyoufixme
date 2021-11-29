export function execCodeWithWorker(code, opts) {
  function codeToUrl(code) {
    const blob = new Blob(['(' + String(code) + ')()'], {
      type: 'text/javascript',
    });
    return URL.createObjectURL(blob);
  }

  const random = Math.random().toString(32).substring(2);
  const worker = new Worker(
    codeToUrl(`
      function () {
        ${
          opts.dependencies
            ? 'importScripts(' +
              opts.dependencies.map(d => '"' + d + '"').join(', ') +
              ')'
            : ''
        }

        // 특정 메소드를 사용자 접근 불가하도록 제거
        delete WorkerGlobalScope.prototype.importScripts;
        delete WorkerGlobalScope.prototype.fetch;
        delete self.close;

        // 제거한 prototype을 수정 불가하도록 변경
        Object.freeze(WorkerGlobalScope.prototype);

        onmessage = function (message) {
          try {
            // 문법검사
            new Function(message.data);

            const func = new Function(
              '$$__cyfm__${random}, ' +
              'console, ' +
              'postMessage, ' +
              'self, ' +
              'globalThis', \`
              \${message.data}
              return $$__cyfm__${random};
            \`);
            const key = func.call(
              {},  /* Context */
              '${random}',  /* Key */
              Object.freeze({  /* Console mock */
                log: function () {
                  postMessage({
                    key: '${random}',
                    type: 'stdout',
                    payload: [].slice.call(arguments).join(' '),
                  });
                  console.log.apply(null, arguments);
                },
              }),
              undefined,  /* postMessage */
              {},  /* self */
              {}  /* globalThis */
            );

            postMessage({
              key: key,
              type: 'done',
            });
          } catch (e) {
            postMessage({
              key: '${random}',
              type: 'error',
              payload: e.stack || e.message || 'Uncaught: ' + String(e),
            });
          }
        };
      }
    `),
  );
  const process = new EventTarget();
  worker.addEventListener('message', function (event) {
    const message = event.data;
    try {
      if (message.key !== random) {
        throw new SyntaxError(`Illegal return statement`);
      }
      switch (message.type) {
        case 'stdout':
          process.dispatchEvent(
            new CustomEvent('stdout', { detail: message.payload }),
          );
          break;
        case 'error':
          process.dispatchEvent(
            new CustomEvent('error', { detail: message.payload }),
          );
          break;
        case 'done':
          process.dispatchEvent(new CustomEvent('exit', { detail: 0 }));
        /* eslint-disable-next-line no-fallthrough */
        default:
          worker.terminate();
          break;
      }
    } catch (e) {
      process.dispatchEvent(
        new CustomEvent('error', { detail: e.stack || e.message }),
      );
    }
  });
  process.kill = function (exitCode) {
    worker.terminate();
    process.dispatchEvent(new CustomEvent('exit', { detail: exitCode || -1 }));
  };
  worker.postMessage(code);
  return process;
}
