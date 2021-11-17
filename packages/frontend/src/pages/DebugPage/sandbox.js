export function sandboxFunction(code, origin) {
  var postMessage;
  window.onmessage = function (message) {
    if (message.origin === origin && message.ports) {
      const [port2] = message.ports;

      postMessage = function (data) {
        port2.postMessage(data);
      };
    }

    const random = Math.random();
    function randomName() {
      return '__' + random.toString(32).substring(2).replace(/[0-9]/g, '');
    }
    const randomSuffix = randomName();

    const result = (function (random) {
      try {
        /* eslint-disable-next-line no-new-func */
        const codeFunc = new Function(
          'random' + randomSuffix,
          code + '\nreturn random' + randomSuffix,
        );
        return codeFunc(random);
      } catch (e) {
        postMessage({
          type: 'error',
          payload: {
            message: e.message,
          },
        });
      }
      return random;
    })(random);

    if (random !== result) {
      postMessage({
        type: 'error',
        payload: {
          message: '잘못된 구문 return 사용',
        },
      });
    } else {
      postMessage({
        type: 'success',
      });
    }
  };
}
