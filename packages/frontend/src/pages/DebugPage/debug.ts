interface IExecutionResult {
  type: 'init' | 'error' | 'success';
  payload?: unknown;
}

function execCodeWithSandbox(code: string): Promise<IExecutionResult> {
  return new Promise((resolve, reject) => {
    const sandbox = document.createElement('iframe');
    sandbox.setAttribute('sandbox', 'allow-scripts');
    sandbox.srcdoc = `
      <script src="https://cdn.jsdelivr.net/npm/chai@4.3.4/chai.js"></script>
      <script>
        Object.freeze(chai);
        Object.freeze(Object.prototype);
      </script>
      <script>
        var postMessage;
        window.onmessage = function (message) {
          if (message.origin === '${window.origin}' && message.ports) {
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
              const codeFunc = new Function(
                'random' + randomSuffix,
                \`${code}\` + '\\nreturn random' + randomSuffix,
              );
              return codeFunc(random);
            } catch (e) {
              postMessage({
                type: 'error',
                payload: {
                  message: e.message,
                }
              });
            }
            return random;
          })(random);

          if (random !== result) {
            postMessage({
              type: 'error',
              payload: {
                message: '잘못된 구문 return 사용',
              }
            });
          } else {
            postMessage({
              type: 'success'
            });
          }
        };
      </script>
    `;
    const { port1, port2 } = new MessageChannel();

    port1.onmessage = (e: MessageEvent) => {
      sandbox.parentNode?.removeChild(sandbox);
      resolve(e.data);
    };

    sandbox.onload = () => {
      sandbox.contentWindow?.postMessage({ type: 'init' }, '*', [port2]);
    };

    document.body.appendChild(sandbox);
  });
}

const runner = async ({
  code,
  testCode,
}: {
  code: string;
  testCode: string[];
}) => {
  return execCodeWithSandbox(`
    const { expect } = chai;
    ${code}
    ${testCode.join('\n')}
  `);
};

export default runner;
