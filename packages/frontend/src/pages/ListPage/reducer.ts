import type { IProblem } from '@cyfm/types';

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

export { paginationReducer };
