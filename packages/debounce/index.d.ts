type Callback<T> = (...args: Array<unknown>) => T;
declare const debounce: (
  callback: Callback<unknown>,
  time: number,
) => Callback<void>;
declare const debouncePromise: (
  callback: Callback<unknown>,
  time: number,
) => Callback<Promise<unknown>>;

export { debounce, debouncePromise };
