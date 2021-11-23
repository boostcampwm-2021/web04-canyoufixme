/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-new-func */

const runner = ({ chaiString, code, testCode }) => {
  try {
    const codeRunner = new Function(
      `${chaiString}
        const {expect} = chai;
        ${code}
        ${testCode}
      `,
    );
    codeRunner();
    return 'success';
  } catch (err) {
    return err.toString();
  }
};

export const debug = {
  runner,
};
