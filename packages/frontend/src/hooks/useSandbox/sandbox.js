export function sandboxFunction(code, fork, origin, opts) {
  var postMessage;
  window.onmessage = function (message) {
    if (message.origin === origin && message.ports) {
      const port2 = message.ports[0];

      postMessage = function (data) {
        port2.postMessage(data);
      };

      const process = fork(code, opts);
      process.addEventListener('stdout', function (event) {
        postMessage({
          type: 'stdout',
          payload: event.detail,
        });
      });
      process.addEventListener('error', function (event) {
        postMessage({
          type: 'error',
          payload: event.detail,
        });
      });
      process.addEventListener('exit', function (event) {
        postMessage({ type: 'exit', payload: event.details });
      });

      port2.addEventListener('message', function (event) {
        if (event.data && event.data.type === 'kill') {
          process.kill();
        }
      });
      port2.start();
    }
  };
}
