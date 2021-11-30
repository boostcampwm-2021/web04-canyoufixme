export type ActionPayload = {
  target: string;
};

export type OpenAction = {
  type: 'open';
  payload: ActionPayload;
};

export type CloseAction = {
  type: 'close';
  payload: ActionPayload;
};

export type ModalReducerAction = OpenAction | CloseAction;

export interface ModalBaseProps {
  isOpen: boolean;
  setter: React.Dispatch<ModalReducerAction>;
  target: string;
}
