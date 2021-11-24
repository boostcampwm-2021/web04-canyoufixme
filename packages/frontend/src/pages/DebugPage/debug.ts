import { sandboxFunction } from './sandbox';
import { execCodeWithWorker } from './worker';

interface IExecutionResult {
  type: 'init' | 'error' | 'success';
  payload?: unknown;
}

function escapeTemplate(code: string) {
  return code.replaceAll(/([\\$`])/g, '\\$1');
}

function escapeClosingTag(code: string) {
  return code.replaceAll(/<\//g, '\\x3c/');
}

function escapeCode(code: string) {
  return escapeClosingTag(escapeTemplate(code));
}

function escapeIfNotFunc(value: unknown) {
  const stringValue = String(value);
  return typeof value !== 'function' ? escapeCode(stringValue) : stringValue;
}

function escaped(strings: TemplateStringsArray, ...args: unknown[]) {
  return (
    strings[0] +
    strings
      .slice(1)
      .reduce((acc, s, i) => acc + escapeIfNotFunc(args[i]) + s, '')
  );
}

function execCodeWithSandbox(
  code: string,
  testCodes: string[],
  setup: string,
): Promise<IExecutionResult> {
  return new Promise((resolve, reject) => {
    const sandbox = document.createElement('iframe');
    sandbox.style.display = 'none';
    sandbox.height = sandbox.width = '0';
    sandbox.setAttribute('sandbox', 'allow-scripts');
    sandbox.srcdoc = escaped`
      <html>
        <head>
          <meta charset="utf-8">
          <meta
            http-equiv="content-security-policy"
            content="script-src https://cdn.jsdelivr.net blob: 'unsafe-inline' 'unsafe-eval';">
        </head>
        <body>
          <script>
            (${sandboxFunction})(
              \`${code}\`,
              ${JSON.stringify(testCodes)},
              \`${setup}\`,
              (${execCodeWithWorker}),
              \`${window.origin}\`);
          </script>
        </body>
      </html>
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
  return execCodeWithSandbox(code, testCode, 'const { expect } = chai;');
};

export default runner;
