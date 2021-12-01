/* eslint-disable prefer-destructuring */
export const SEC = 1000;
export const TIMEOUT = 5;
export const COOKIE_MAX_AGE = SEC * 3600 * 12;
export const COOKIE_SECRET = process.env.COOKIE_SECRET;

export const WRONG_ANSWER_MESSAGE = '틀렸습니다.';
export const CORRECT_ANSWER_MESSAGE = '맞았습니다!!!';

export const GET_ALL_DATA_ERROR = 'cannot get all data.';
export const GET_MOST_SUBMIT_PROBLEM_ERROR = 'cannot get most submit problems';
export const GET_MOST_CORRECT_SUBMIT_PROBLEM_ERROR =
  'cannot get most correct problems';
export const GET_MOST_WRONG_SUBMIT_PROBLEM_ERROR =
  'cannot get most wrong problems';
export const GET_USER_COUNT_ERROR = 'cannot get user count.';
export const GET_SUBMIT_COUNT_ERROR = 'cannot get submit count.';
export const GET_PROBLEM_COUNT_ERROR = 'cannot get problem count.';
export const IS_NOT_LOGIN = '로그인 필요.';
export const LOAD_FAIL = 'load fail';
export const WRITE_SUCCESS = 'write success';
export const WRITE_FAIL = 'write fail';

export enum CONDITION {
  'ALL',
  'CORRECT',
  'WRONG',
}
