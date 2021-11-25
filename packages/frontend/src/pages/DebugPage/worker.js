export function execCodeWithWorker(code, testCodes, setup) {
  return new Promise((resolve, reject) => {
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

              const func = new Function('$$__cyfm__${random},console', \`
                \${message.data}
                return $$__cyfm__${random};
              \`);
              const key = func('${random}', console);

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
                    message: e instanceof Error ? e.message : e
                  }
                })
              );
            }
          };
        }
      `),
    );

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
    worker.postMessage(code);
  });
}
