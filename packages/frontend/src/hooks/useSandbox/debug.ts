import type React from 'react';
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

export interface ISandboxOptions {
  dependencies?: string[];
}
export function execCodeWithSandbox(options: ISandboxOptions) {
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
          content="script-src blob: 'unsafe-inline' 'unsafe-eval'
          ${options.dependencies?.join(' ')};">
      </head>
      <body>
        <script>
          (function () {
            var process = (${execCodeWithWorker})(${JSON.stringify(options)});
            (${sandboxFunction})(process, \`${window.origin}\`);
          })();
        </script>
      </body>
    </html>
  `;
  const { port1, port2 } = new MessageChannel();

  const dispatcher = new EventTarget();

  port1.onmessage = (e: MessageEvent) => {
    const { data } = e;
    try {
      switch (data.type) {
        // @ts-expect-error
        case 'init':
          dispatcher.dispatchEvent(new CustomEvent('init'));
        // eslint-disable-next-line no-fallthrough
        case 'idle':
          dispatcher.dispatchEvent(new CustomEvent('idle'));
          break;
        case 'stdout':
          dispatcher.dispatchEvent(
            new CustomEvent('stdout', { detail: data.payload }),
          );
          break;
        case 'error':
          dispatcher.dispatchEvent(
            new CustomEvent('stderr', { detail: data.payload }),
          );
          break;
        case 'exit':
        default:
          dispatcher.dispatchEvent(
            new CustomEvent('exit', { detail: data.payload }),
          );
          break;
      }
    } catch (e) {
      // sandbox.parentNode?.removeChild(sandbox);
      dispatcher.dispatchEvent(new CustomEvent('exit', { detail: e }));
    }
  };

  dispatcher.addEventListener('kill', () => {
    port1.postMessage({ type: 'kill' });
  });

  dispatcher.addEventListener('exec', event => {
    port1.postMessage({ type: 'exec', payload: (event as CustomEvent).detail });
  });

  sandbox.onload = () => {
    sandbox.contentWindow?.postMessage({ type: 'init' }, '*', [port2]);
  };
  document.body.appendChild(sandbox);

  return dispatcher;
}
