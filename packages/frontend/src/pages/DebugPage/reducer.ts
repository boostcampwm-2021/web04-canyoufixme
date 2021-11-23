type DebugStates = {
  content: string;
  testCode: string[];
  initCode: string;
  code: string;
};

type InitAction = {
  type: 'init';
  payload: Omit<DebugStates, 'initCode'>;
};
type SetCodeAction = {
  type: 'setCode';
  payload: Pick<DebugStates, 'code'>;
};
type DebugReducerAction = InitAction | SetCodeAction;

const debugReducer = (
  state: DebugStates,
  action: DebugReducerAction,
): DebugStates => {
  switch (action.type) {
    case 'init':
      return {
        initCode: action.payload.code,
        content: state.content || action.payload.content,
        code: state.code || action.payload.code,
        testCode: [...action.payload.testCode],
      };
    case 'setCode':
      return {
        ...state,
        code: action.payload.code,
      };
    default:
      return state;
  }
};

export { debugReducer };
