/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-new-func */

const runner = ({ chaiString, code, testCode }) => {
  const codeRunner = new Function(`
    ${chaiString}
    //프로세스 조작 시스템 명령어 방지용 코드
    const process = undefined;
    Object.freeze(process);

    const { expect } = chai;
    ${code}
    ${testCode}
  `);
  codeRunner();
};

export const debug = {
  runner,
};
