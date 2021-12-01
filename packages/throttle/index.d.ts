type Callback<T> = (...args: Array<unknown>) => T;
declare const throttle: (
  callback: Callback<unknown>,
  time: number,
) => Callback<void>;
declare const throttlePromise: (
  callback: Callback<unknown>,
  time: number,
) => Callback<Promise<unknown>>;

export { throttle, throttlePromise };
