/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-new-func */

const runner = ({ chaiString, code, testCode }) => {
  const codeRunner = new Function(`
    ${chaiString}
    const { expect } = chai;
    ${code}
    ${testCode}
  `);
  codeRunner();
};

export const debug = {
  runner,
};
