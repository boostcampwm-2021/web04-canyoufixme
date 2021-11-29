import { sandboxFunction } from './sandbox';
import { execCodeWithWorker } from './worker';

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

class Exit extends Error {
  constructor(exitCode: number) {
    super(`exitCode: ${exitCode}`);
    this.name = 'Exit';
  }
}

export interface ISandboxOptions {
  dependencies?: string[];
}
export function execCodeWithSandbox(
  code: string,
  options: ISandboxOptions = {
    dependencies: [],
  },
) {
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
          content="script-src ${options.dependencies?.join(
            ' ',
          )} blob: 'unsafe-inline' 'unsafe-eval';">
      </head>
      <body>
        <script>
          (${sandboxFunction})
            (\`${code}\`,
            (${execCodeWithWorker}),
            \`${window.origin}\`,
            ${JSON.stringify(options)});
        </script>
      </body>
    </html>
  `;
  const { port1, port2 } = new MessageChannel();

  const dispatcher = new EventTarget();
  dispatcher.addEventListener('kill', event => {
    port1.postMessage({ type: 'kill' });
  });

  port1.onmessage = (e: MessageEvent) => {
    const { data } = e;
    try {
      switch (data.type) {
        case 'stdout':
          dispatcher.dispatchEvent(
            new CustomEvent('stdout', { detail: data.payload }),
          );
          break;
        // @ts-ignore
        case 'error':
          dispatcher.dispatchEvent(
            new CustomEvent('stderr', { detail: data.payload }),
          );
        // eslint-disable-next-line no-fallthrough
        default:
        case 'exit':
          throw new Exit(0);
      }
    } catch (e) {
      sandbox.parentNode?.removeChild(sandbox);
      dispatcher.dispatchEvent(new CustomEvent('exit', { detail: e }));
    }
  };

  sandbox.onload = () => {
    sandbox.contentWindow?.postMessage({ type: 'init' }, '*', [port2]);
  };
  document.body.appendChild(sandbox);

  return dispatcher;
}
