import type { IProblem } from '@cyfm/types';
import type { ModalReducerAction } from 'components/Modal/ModalType';

interface IPaginationState {
  items: IProblem[];
  offset: number;
}

interface IPaginationAction {
  type: string;
  items?: IProblem[];
  offset: number;
}

const paginationReducer = (
  state: IPaginationState,
  action: IPaginationAction,
): IPaginationState => {
  switch (action.type) {
    case 'addItems':
      return {
        ...state,
        items: [...state.items, ...(action.items as IProblem[])],
      };
    case 'incOffset':
      return {
        ...state,
        offset: state.offset + action.offset,
      };
    default:
      return state;
  }
};

type ModalState = {
  openError: boolean;
};

const modalReducer = (state: ModalState, action: ModalReducerAction) => {
  const isOpen = action.type === 'open';
  switch (action.payload.target) {
    case 'error':
      return { ...state, openError: isOpen };
    default:
      return state;
  }
};

export { paginationReducer, modalReducer };
