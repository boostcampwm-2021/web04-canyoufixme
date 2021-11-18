import React from 'react';
import { nanoid } from 'nanoid';

import styled from '@cyfm/styled';

import Modal from './Modal';
import Button from './ModalButton';

interface ModalProps {
  isOpen: boolean;
  setter: (isOpen: boolean) => void;
  messages: string[];
}

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: space-evenly;
  align-items: center;
`;

const MessageWrapper = styled.div`
  display: flex;
  text-align: center;
  align-items: center;
`;

const ButtonWrapper = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-evenly;
`;

const MessageModal = (props: ModalProps) => {
  const { isOpen, setter, messages } = props;

  const closeModal = () => setter(false);
  return (
    <Modal isOpen={isOpen} setter={setter}>
      <ContentWrapper>
        {messages.map(message => (
          <MessageWrapper key={nanoid()}>{message}</MessageWrapper>
        ))}
      </ContentWrapper>
      <ButtonWrapper>
        <Button onClick={closeModal}>닫기</Button>
      </ButtonWrapper>
    </Modal>
  );
};

export default MessageModal;
