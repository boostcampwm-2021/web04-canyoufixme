const debounce = (callback, time) => {
  let timeout;
  return (...args) => {
    if (!timeout) {
      callback(...args);
      timeout = setTimeout(() => {
        clearTimeout(timeout);
        timeout = null;
      }, time);
    }
  };
};

const debouncePromise = (callback, time) => {
  let timeout;
  return (...args) => {
    return new Promise((resolve, reject) => {
      if (!timeout) {
        timeout = setTimeout(() => {
          clearTimeout(timeout);
          timeout = null;
        }, time);
        try {
          resolve(callback(...args));
        } catch (e) {
          reject(e.message);
        }
      }
    });
  };
};

export { debounce, debouncePromise };
