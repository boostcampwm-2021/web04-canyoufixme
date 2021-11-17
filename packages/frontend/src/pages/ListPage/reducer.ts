interface User {
  id: number;
  name: string;
  oauthType: string;
  token: string;
}

interface Item {
  id: number;
  title: string;
  author: User;
  category: string;
  codeId: string;
  level: number;
}

interface paginationState {
  items: Item[];
  offset: number;
}

interface paginationAction {
  type: string;
  items?: Item[];
  offset: number;
}

const paginationReducer = (
  state: paginationState,
  action: paginationAction,
): paginationState => {
  switch (action.type) {
    case 'addItems':
      return {
        ...state,
        items: [...state.items, ...(action.items as Item[])],
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
