import { sandboxFunction } from './sandbox';
import { execCodeWithWorker } from './worker';

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
      <script>
        (${sandboxFunction})(\`${code}\`, \`${window.origin}\`, (${execCodeWithWorker}));
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
    ${escapeBackticks(testCode.join('\n'))}
  `);
};

export default runner;
