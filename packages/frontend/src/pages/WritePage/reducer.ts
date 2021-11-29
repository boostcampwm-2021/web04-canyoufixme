type ModalState = {
  openCategory: boolean;
  openLevel: boolean;
  openLoading: boolean;
  openSubmit: boolean;
  openSuccess: boolean;
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
  switch (action.type) {
    case 'open':
      switch (action.payload.target) {
        case 'category':
          return { ...state, openCategory: true };
        case 'level':
          return { ...state, openLevel: true };
        case 'loading':
          return { ...state, openLoading: true };
        case 'submit':
          return { ...state, openSubmit: true };
        case 'success':
          return { ...state, openSuccess: true };
        case 'message':
          return { ...state, openMessage: true };
        default:
          return state;
      }

    case 'close':
      switch (action.payload.target) {
        case 'category':
          return { ...state, openCategory: false };
        case 'level':
          return { ...state, openLevel: false };
        case 'loading':
          return { ...state, openLoading: false };
        case 'submit':
          return { ...state, openSubmit: false };
        case 'success':
          return { ...state, openSuccess: false };
        case 'message':
          return { ...state, openMessage: false };
        default:
          return state;
      }
  }
};

export { modalReducer };
