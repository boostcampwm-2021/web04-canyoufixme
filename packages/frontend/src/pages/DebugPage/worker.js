export function execCodeWithWorker(code, testCodes, setup) {
  function escapeBackticks(code) {
    return code.replaceAll(/`/g, '\\`');
  }

  return new Promise((resolve, reject) => {
    function codeToUrl(code) {
      const blob = new Blob(['(' + String(code) + ')()'], {
        type: 'text/javascript',
      });
      return URL.createObjectURL(blob);
    }

    const testPromises = testCodes.map(testCode => {
      const random = Math.random().toString(32).substring(2);
      const worker = new Worker(
        codeToUrl(`
          function () {
            importScripts('https://cdn.jsdelivr.net/npm/chai@4.3.4/chai.js');

            // 특정 메소드를 사용자 접근 불가하도록 제거
            delete WorkerGlobalScope.prototype.importScripts;
            delete WorkerGlobalScope.prototype.fetch;
            delete self.close;

            // 제거한 prototype을 수정 불가하도록 변경
            Object.freeze(WorkerGlobalScope.prototype);

            onmessage = function (message) {
              try {
                // 문법검사
                new Function(\`${escapeBackticks(code)}\`);

                const func = new Function('$$__cyfm__${random}', \`
                  ${escapeBackticks(setup)}
                  ${escapeBackticks(code)}
                  \${message.data}

                  return $$__cyfm__${random};
                \`);
                const key = func('${random}');

                postMessage(
                  JSON.stringify({
                    key: key,
                    type: 'success'
                  })
                );
              } catch (e) {
                postMessage(
                  JSON.stringify({
                    key: '${random}',
                    type: 'error',
                    result: {
                      message: e.message
                    }
                  })
                );
              }
            };
          }
        `),
      );

      return new Promise((resolve, reject) => {
        const timeout = 5;
        const timer = setTimeout(() => {
          worker.terminate();
          reject({
            message: `timeout ${timeout}s`,
          });
        }, 1000 * timeout);

        worker.onmessage = function (message) {
          clearTimeout(timer);
          try {
            const parsedMessage = JSON.parse(message.data);
            if (parsedMessage.key === random) {
              if (parsedMessage.type === 'success') {
                resolve(parsedMessage.result);
              } else if (parsedMessage.type === 'error') {
                reject(parsedMessage.result);
              }
            } else {
              reject({
                message: `Illegal return statement`,
              });
            }
          } catch (e) {
            reject(e);
          }
        };
        worker.postMessage(testCode);
      });
    });

    Promise.all(testPromises).then(resolve).catch(reject);
  });
}
