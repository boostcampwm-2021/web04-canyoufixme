import { ResultCode } from './enums';

export interface IUser {
  name: string;
}

export interface IProblem {
  title: string;
  category: string;
  level: number;
  codeId: string;
  author: IUser;
}

export interface IProblemCode {
  code: string;
  testCode: string[];
  content: string;
}

export interface ISubmitCode {
  code: string;
  testResult: string[];
}

export interface ISubmitLog {
  status: string;
  correctTestCount: number;
  wrongTestCount: number;
  codeId: string;
  user: IUser;
  problem: IProblem;
}

export interface ITestCase {
  title: string;
  code: string;
  id: string;
}

export type ITestCaseResult = Pick<ITestCase, 'id'> & {
  result: ResultCode;
};

export interface IGuideline {
  title: string;
  content: string;
  type: 'testcase' | 'code';
  codes: string[];
}

export interface IGuidelineWithCode {
  title: string;
  content: string;
  codes: string;
}

export interface ITestResult {
  type: 'success' | 'fail';
  payload?: { message: string };
}
