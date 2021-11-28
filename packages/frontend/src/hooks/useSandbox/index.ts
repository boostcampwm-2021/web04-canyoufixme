import { useCallback } from 'react';
import { execCodeWithSandbox } from './debug';

export function useSandbox(
  code: string,
  callbackWrapper: (dispatcher: EventTarget) => void,
) {
  const callback = useCallback(() => {
    callbackWrapper(execCodeWithSandbox(code));
  }, [callbackWrapper, code]);

  return callback;
}
