export function sandboxFunction(process, origin) {
  var postMessage;
  window.onmessage = function (message) {
    if (message.origin === origin && message.ports) {
      const port2 = message.ports[0];

      postMessage = function (data) {
        port2.postMessage(data);
      };

      process.addEventListener('init', function () {
        postMessage({ type: 'init' });
      });
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
        postMessage({
          type: 'exit',
          payload: event.detail,
        });
      });
      process.addEventListener('idle', function (event) {
        postMessage({ type: 'idle', payload: event.detail });
      });

      port2.addEventListener('message', function (event) {
        if (event.data) {
          switch (event.data.type) {
            case 'kill':
              process.kill(event.data.payload || -1);
              break;
            case 'exec':
              process.exec(event.data.payload);
              break;
            default:
              break;
          }
        }
      });
      port2.start();
    }
  };
}
