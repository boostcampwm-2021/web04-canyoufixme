import type { IProblem } from '@cyfm/types';

type ProblemStatistics = {
  [k in keyof IProblem as `problem_${k}`]: IProblem[k];
};

type IntroState = {
  problemCount: string;
  targetProblemCount: number;
  submitCount: string;
  targetSubmitCount: number;
  userCount: string;
  targetUserCount: number;
  mostSubmitProblems: ProblemStatistics[];
  mostCorrectProblems: ProblemStatistics[];
  mostWrongProblems: ProblemStatistics[];
};

type setValue = {
  type: 'setValue';
  payload: {
    key: string;
    value: string | number | ProblemStatistics[];
  };
};

type incValue = {
  type: 'incValue';
  payload: {
    key: string;
    value: number;
  };
};

type IntroReducerAction = setValue | incValue;

const incEventCalculation = (num1: string, num2: number): string => {
  return Math.floor(parseInt(num1.replace(',', ''), 10) + num2).toString();
};

const IntroReducer = (
  state: IntroState,
  action: IntroReducerAction,
): IntroState => {
  switch (action.type) {
    case 'setValue':
      switch (action.payload.key) {
        case 'problemCount':
          return { ...state, problemCount: action.payload.value as string };
        case 'targetProblemCount':
          return {
            ...state,
            targetProblemCount: action.payload.value as number,
          };
        case 'submitCount':
          return { ...state, submitCount: action.payload.value as string };
        case 'targetSubmitCount':
          return {
            ...state,
            targetSubmitCount: action.payload.value as number,
          };
        case 'userCount':
          return { ...state, userCount: action.payload.value as string };
        case 'targetUserCount':
          return { ...state, targetUserCount: action.payload.value as number };
        case 'mostSubmitProblems':
          return {
            ...state,
            mostSubmitProblems: action.payload.value as ProblemStatistics[],
          };
        case 'mostCorrectProblems':
          return {
            ...state,
            mostCorrectProblems: action.payload.value as ProblemStatistics[],
          };
        case 'mostWrongProblems':
          return {
            ...state,
            mostWrongProblems: action.payload.value as ProblemStatistics[],
          };
        default:
          return state;
      }
    case 'incValue':
      switch (action.payload.key) {
        case 'problemCount':
          return {
            ...state,
            problemCount: incEventCalculation(
              state.problemCount,
              action.payload.value,
            ),
          };
        case 'submitCount':
          return {
            ...state,
            submitCount: incEventCalculation(
              state.submitCount,
              action.payload.value,
            ),
          };
        case 'userCount':
          return {
            ...state,
            userCount: incEventCalculation(
              state.userCount,
              action.payload.value,
            ),
          };
        default:
          return state;
      }
    default:
      return state;
  }
};

export { IntroReducer };