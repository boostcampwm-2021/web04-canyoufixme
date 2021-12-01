import { VALID_LANGUAGES } from './constant';

export const VALIDATION_FAIL_MESSAGE = {
  title: '제목이 입력되지 않았습니다. \n 제목을 입력해주세요.',
  markdown: '문제가 입력되지 않았습니다.\n문제를 입력해주세요.',
  code: '코드가 입력되지 않았습니다.\n코드를 입력해주세요.',
  testcase:
    '테스트 케이스가 입력되지 않았습니다.\n테스트 케이스를 입력해주세요.',
};

export const CHECK_BEFORE_SUBMIT_MESSAGE =
  '제출 후에는 내용을\n변경할 수 없습니다.\n정말로 제출하시겠습니까?';

export const CHECK_IS_VALID_LANGUAGE = `현재는 지원하지 않는 언어입니다.\n빠른 시일 내에 지원하겠습니다.\n현재 사용 가능 언어 : ${VALID_LANGUAGES.join(
  ', ',
)}`;

export const SUBMIT_SUCCESS_MESSAGE =
  '문제 제출에 성공했습니다.\n잠시 후 문제 리스트로 이동합니다.';

export const SUBMIT_FAIL_MESSAGE =
  '출제에 실패했습니다.\n담당자에게 문의 바랍니다.';
