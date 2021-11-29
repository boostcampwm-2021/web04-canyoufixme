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
