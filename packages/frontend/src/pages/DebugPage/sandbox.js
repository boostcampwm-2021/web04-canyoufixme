export function sandboxFunction(code, exec, origin) {
  var postMessage;
  window.onmessage = function (message) {
    if (message.origin === origin && message.ports) {
      const port2 = message.ports[0];

      postMessage = function (data) {
        port2.postMessage(data);
      };

      exec(code)
        .then(payload => postMessage({ type: 'success', payload }))
        .catch(err => postMessage({ type: 'error', payload: err }));
    }
  };
}
