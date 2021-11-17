import { sandboxFunction } from './sandbox';

interface IExecutionResult {
  type: 'init' | 'error' | 'success';
  payload?: unknown;
}

function escapeBackticks(code: string) {
  return code.replaceAll(/`/g, '\\`');
}

function execCodeWithSandbox(code: string): Promise<IExecutionResult> {
  return new Promise((resolve, reject) => {
    const sandbox = document.createElement('iframe');
    sandbox.style.display = 'none';
    sandbox.height = sandbox.width = '0';
    sandbox.setAttribute('sandbox', 'allow-scripts');
    sandbox.srcdoc = `
      <script src="https://cdn.jsdelivr.net/npm/chai@4.3.4/chai.js"></script>
      <script>
        Object.freeze(chai);
        Object.freeze(Object.prototype);
      </script>
      <script>
        (${sandboxFunction})(\`${code}\`, \`${window.origin}\`);
      </script>
    `;
    const { port1, port2 } = new MessageChannel();
    const timeout = 10;
    const timer = setTimeout(() => {
      reject(new Error(`timeout ${timeout}s`));
    }, 1000 * timeout);

    port1.onmessage = (e: MessageEvent) => {
      sandbox.parentNode?.removeChild(sandbox);
      clearTimeout(timer);
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
    ${escapeBackticks(testCode.join('\n'))}
  `);
};

export default runner;
