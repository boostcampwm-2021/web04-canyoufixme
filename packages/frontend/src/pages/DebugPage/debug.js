const runner = async ({ code, setter, testCode }) => {
  const setup = () => {
    return new Promise(resolve => {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/chai@4.3.4/chai.js';

      script.onload = resolve;
      document.head.appendChild(script);
    });
  };
  try {
    // FIXME: iframe sandbox로 변경
    await setup();
    /* eslint-disable-next-line no-new-func */
    const codeRunner = new Function(`
      const { expect } = chai;
      ${code}
      ${testCode}
    `);
    codeRunner();
  } catch (e) {
    setter(`${e.toString()}`);
    return false;
  }
  return true;
};

export default runner;
