/* eslint-disable react-hooks/exhaustive-deps */
import { useRef, useEffect, useCallback, useMemo } from 'react';
import type { MutableRefObject } from 'react';
import { execCodeWithSandbox } from './debug';
import type { ISandboxOptions } from './debug';

// TODO: 공통 상수 분리
const SIGKILL = 137;

interface ISandboxHookOptions extends ISandboxOptions {
  setter: React.Dispatch<React.SetStateAction<string>>;
  onInit?: (event: CustomEvent) => void;
  onExit?: (event: CustomEvent) => void;
  onLoadStart?: (event: CustomEvent) => void;
  onLoadEnd?: (event: CustomEvent) => void;
  timeout?: number;
}

interface Stringable {
  toString: () => string;
}

interface IConsoleLike {
  log: (...args: Stringable[]) => void;
  error: (...args: Stringable[]) => void;
  clear: (...args: Stringable[]) => void;
}

export function useSandbox(
  options: ISandboxHookOptions = {
    setter: () => {},
    onInit: () => {},
    onExit: () => {},
    onLoadStart: () => {},
    onLoadEnd: () => {},
    timeout: 0,
  },
): [MutableRefObject<EventTarget | undefined>, IConsoleLike] {
  const sandboxRef = useRef<EventTarget>();
  useEffect(() => {
    sandboxRef.current = execCodeWithSandbox(options);
  }, []);

  const consoleLog = useCallback((...args) => {
    options?.setter(prev => `${prev}\n${args.join(' ')}`.trim());
  }, []);

  const consoleError = useCallback((...args) => {
    options?.setter(prev => `${prev}\n${args.join(' ')}`.trim());
  }, []);

  const consoleClear = useCallback(() => {
    console.clear();
    options?.setter('[CLEAR]');
  }, []);

  const memoizedConsole = useMemo(
    () => ({
      log: consoleLog,
      error: consoleError,
      clear: consoleClear,
    }),
    [],
  );

  useEffect(() => {
    if (!sandboxRef.current) return;

    const console = memoizedConsole;

    const onInit = (options.onInit ??
      ((_: CustomEvent) => {
        console.log('[OK]');
      })) as EventListener;

    const onExit = (options.onExit ??
      (event => {
        const customEvent = event as CustomEvent;
        if (customEvent.detail === SIGKILL) {
          console.log(`TimeoutError: timeout`);
        }
        console.log(`[EXIT CODE: ${customEvent.detail || -1}]`);

        // 재시작
        sandboxRef.current = execCodeWithSandbox(options);
      })) as EventListener;

    sandboxRef.current.addEventListener('init', onInit);
    sandboxRef.current.addEventListener('exit', onExit);

    const onOutput = (event => {
      console.log((event as CustomEvent).detail);
    }) as EventListener;

    const onOutputError = (event => {
      console.log((event as CustomEvent).detail);
    }) as EventListener;

    sandboxRef.current.addEventListener('stdout', onOutput);
    sandboxRef.current.addEventListener('stderr', onOutputError);

    let timeoutTimer: NodeJS.Timer | number = -1;
    let delayTimer: NodeJS.Timer | number = -1;
    const onExec = (event => {
      if (options.timeout) {
        clearTimeout(timeoutTimer as number);
        timeoutTimer = setTimeout(() => {
          sandboxRef.current?.dispatchEvent(
            new CustomEvent('kill', { detail: SIGKILL }),
          );
        }, options.timeout);
      }
      clearTimeout(delayTimer as number);
      delayTimer = setTimeout(() => {
        options.onLoadStart?.(event as CustomEvent);
      }, 1000);
    }) as EventListener;
    sandboxRef.current.addEventListener('exec', onExec);

    const onTerminate = (event => {
      clearTimeout(delayTimer as number);
      clearTimeout(timeoutTimer as number);
      options.onLoadEnd?.(event as CustomEvent);
    }) as EventListener;
    sandboxRef.current.addEventListener('idle', onTerminate);
    sandboxRef.current.addEventListener('exit', onTerminate);

    return () => {
      sandboxRef.current?.removeEventListener('init', onInit);
      sandboxRef.current?.removeEventListener('exit', onExit);
      sandboxRef.current?.removeEventListener('stdout', onOutput);
      sandboxRef.current?.removeEventListener('stderr', onOutputError);
      sandboxRef.current?.removeEventListener('exec', onExec);
      sandboxRef.current?.removeEventListener('idle', onTerminate);
      sandboxRef.current?.removeEventListener('exit', onTerminate);
    };
  }, [sandboxRef.current]);

  return [sandboxRef, memoizedConsole];
}
