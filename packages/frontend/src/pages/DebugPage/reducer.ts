import type { IProblemCode } from '@cyfm/types';
import { ModalReducerAction } from 'components/Modal/ModalType';

type DebugStates = IProblemCode & {
  initCode: string;
  category: string;
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
        category: state.category || action.payload.category,
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

type ModalState = {
  openLoading: boolean;
  openMessage: boolean;
};

const modalReducer = (
  state: ModalState,
  action: ModalReducerAction,
): ModalState => {
  const isOpen = action.type === 'open';
  switch (action.payload.target) {
    case 'loading':
      return { ...state, openLoading: isOpen };
    case 'message':
      return { ...state, openMessage: isOpen };
    default:
      return state;
  }
};

export { debugReducer, modalReducer };
