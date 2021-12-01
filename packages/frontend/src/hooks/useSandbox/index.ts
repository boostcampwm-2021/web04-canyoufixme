/* eslint-disable react-hooks/exhaustive-deps */
import { useRef, useEffect, useCallback, useMemo } from 'react';
import type { MutableRefObject } from 'react';
import { execCodeWithSandbox } from './debug';
import type { ISandboxOptions } from './debug';

interface ISandboxHookOptions extends ISandboxOptions {
  setter: React.Dispatch<React.SetStateAction<string>>;
  onInit?: (event: CustomEvent) => void;
  onExit?: (event: CustomEvent) => void;
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
        console.log(`[EXIT CODE: ${(event as CustomEvent).detail || -1}]`);
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

    return () => {
      sandboxRef.current?.removeEventListener('init', onInit);
      sandboxRef.current?.removeEventListener('exit', onExit);
      sandboxRef.current?.removeEventListener('stdout', onOutput);
      sandboxRef.current?.removeEventListener('stderr', onOutputError);
    };
  }, [sandboxRef]);

  return [sandboxRef, memoizedConsole];
}
