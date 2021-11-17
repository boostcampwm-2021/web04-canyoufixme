export function sandboxFunction(code, origin, exec) {
  var postMessage;
  window.onmessage = function (message) {
    if (message.origin === origin && message.ports) {
      const [port2] = message.ports;

      postMessage = function (data) {
        port2.postMessage(data);
      };

      exec(code)
        .then(payload => postMessage({ type: 'success', payload }))
        .catch(err => postMessage({ type: 'error', payload: err }));
    }
  };
}
