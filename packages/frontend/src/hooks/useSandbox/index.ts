import { useCallback } from 'react';
import { execCodeWithSandbox } from './debug';
import type { ISandboxOptions } from './debug';

export function useSandbox(
  code: string,
  callbackWrapper: (dispatcher: EventTarget) => void,
  options?: ISandboxOptions,
) {
  const callback = useCallback(() => {
    callbackWrapper(execCodeWithSandbox(code, options));
  }, [callbackWrapper, code, options]);

  return callback;
}
