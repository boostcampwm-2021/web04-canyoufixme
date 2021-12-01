const throttle = (callback, time) => {
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

const throttlePromise = (callback, time) => {
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

export { throttle, throttlePromise };
