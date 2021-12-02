type ModalState = {
  openCategory: boolean;
  openLevel: boolean;
  openLoading: boolean;
  openSubmit: boolean;
  openSuccess: boolean;
  openValidate: boolean;
  openMessage: boolean;
};

type ActionPayload = {
  target: string;
};

type OpenAction = {
  type: 'open';
  payload: ActionPayload;
};

type CloseAction = {
  type: 'close';
  payload: ActionPayload;
};

type ModalReducerAction = OpenAction | CloseAction;

const modalReducer = (
  state: ModalState,
  action: ModalReducerAction,
): ModalState => {
  const isOpen = action.type === 'open';
  switch (action.payload.target) {
    case 'category':
      return { ...state, openCategory: isOpen };
    case 'level':
      return { ...state, openLevel: isOpen };
    case 'loading':
      return { ...state, openLoading: isOpen };
    case 'submit':
      return { ...state, openSubmit: isOpen };
    case 'success':
      return { ...state, openSuccess: isOpen };
    case 'validate':
      return { ...state, openValidate: isOpen };
    case 'message':
      return { ...state, openMessage: isOpen };
    default:
      return state;
  }
};

export { modalReducer };
