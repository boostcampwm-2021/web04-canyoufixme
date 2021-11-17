export function execCodeWithWorker(code) {
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
        importScripts('https://cdn.jsdelivr.net/npm/chai@4.3.4/chai.js');
        onmessage = function () {
          try {
            const func = new Function(\`${code}\`);
            func();

            postMessage(
              JSON.stringify({
                key: '${random}',
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
        }
      } catch (e) {
        reject(e);
      }
    };
    worker.postMessage('PING');
  });
}
