type ModalState = {
    message: string;
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
      case 'message':
        return { ...state, openMessage: isOpen };
      default:
        return state;
    }
  };
  
  export { modalReducer };
  