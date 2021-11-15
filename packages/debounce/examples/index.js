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

const exampleInput = document.querySelector('#example_input');
const exampleBtn = document.querySelector('#example_btn');
const exampleOutput = document.querySelector('#example_output');

const func = (str, a, b) => {
  const result = str + a + b;
  exampleOutput.innerHTML += `<p>${result}</p>`;
  return result;
};

const test = debounce(func, 3000);
const testPromise = debouncePromise(func, 3000);
exampleBtn.addEventListener('click', () => {
  test(exampleInput.value, 'hi', 'hhh');
  testPromise(exampleInput.value, 'hi', 'hhh');
});
