export function execCodeWithWorker(opts) {
  function codeToUrl(code) {
    const blob = new Blob(['(' + String(code) + ')()'], {
      type: 'text/javascript',
    });
    return URL.createObjectURL(blob);
  }

  const random = Math.random().toString(32).substring(2);
  const dependencies = opts.dependencies
    ? 'importScripts(' +
      opts.dependencies.map(d => '"' + d + '"').join(', ') +
      ')'
    : '';
  const worker = new Worker(
    codeToUrl(`
      function () {
        ${dependencies}

        // 특정 메소드를 사용자 접근 불가하도록 제거
        delete WorkerGlobalScope.prototype.importScripts;
        delete WorkerGlobalScope.prototype.fetch;
        delete self.close;

        onmessage = function (message) {
          if (message.data === null) {
            postMessage({
              key: '${random}',
              type: 'init',
            });
            return;
          }

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
              {  /* Console mock */
                log: function () {
                  postMessage({
                    key: '${random}',
                    type: 'stdout',
                    payload: [].slice.call(arguments).join(' '),
                  });
                  console.log.apply(null, arguments);
                },
              },
              undefined,  /* postMessage */
              {},  /* self */
              {},  /* globalThis */
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
        case 'init':
          process.dispatchEvent(new CustomEvent('init'));
          break;
        case 'stdout':
          process.dispatchEvent(
            new CustomEvent('stdout', { detail: message.payload }),
          );
          break;
        case 'error':
          process.dispatchEvent(
            new CustomEvent('error', { detail: message.payload }),
          );
        // eslint-disable-next-line no-fallthrough
        case 'done':
        default:
          process.dispatchEvent(new CustomEvent('idle'));
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

  process.exec = function (code) {
    worker.postMessage(code);
  };
  worker.postMessage(null);

  return process;
}
