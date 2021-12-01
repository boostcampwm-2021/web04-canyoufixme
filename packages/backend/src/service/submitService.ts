/* eslint-disable no-unused-expressions */
/* eslint-disable no-plusplus */
import { SubmitCodeModel } from '../setting/mongoConfig';
import { SubmitLog } from '../model/SubmitLog';
import { Problem } from '../model/Problem';

import { WRONG_ANSWER_MESSAGE, CORRECT_ANSWER_MESSAGE } from '../util/constant';
import { getCodeId } from '../util/common';

const saveSubmitCode = async ({ code, testResult }) => {
  const submitCode = new SubmitCodeModel();
  submitCode.code = code;
  submitCode.testResult = testResult;

  const codeData = await submitCode.save();
  return codeData;
};

const saveSubmitLog = async ({ problem, user, codeId, testResult }) => {
  let wrongTestCount = 0;
  let correctTestCount = 0;
  testResult.forEach(test => {
    test === 'success' ? correctTestCount++ : wrongTestCount++;
  });

  const submitLog = new SubmitLog();
  submitLog.problem = problem;
  submitLog.user = user;
  submitLog.status =
    wrongTestCount !== 0 ? WRONG_ANSWER_MESSAGE : CORRECT_ANSWER_MESSAGE;
  submitLog.wrongTestCount = wrongTestCount;
  submitLog.correctTestCount = correctTestCount;
  submitLog.codeId = codeId;

  await submitLog.save();
};

const saveSubmit = async ({ user, code, testResult, problemCodeId }) => {
  try {
    const problem = await Problem.findOne({ codeId: problemCodeId });
    const codeData = await saveSubmitCode({ code, testResult });
    const codeId = getCodeId(codeData);

    const result = await saveSubmitLog({ problem, user, codeId, testResult });
    return result;
  } catch (err) {
    return err;
  }
};

export { saveSubmit };
