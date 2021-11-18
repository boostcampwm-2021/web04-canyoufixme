/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-new-func */

const runner = ({ chaiString, code, testCode }) => {
  const result = testCode.map(test => {
    try {
      const codeRunner = new Function(
        `${chaiString}
        const {expect} = chai;
                ${code}
                ${test}
            `,
      );
      codeRunner();
      return 'success';
    } catch (err) {
      return err.toString();
    }
  });
  return result;
};

export const debug = {
  runner,
};
