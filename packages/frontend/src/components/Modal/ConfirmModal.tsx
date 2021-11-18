import React from 'react';

import styled from '@cyfm/styled';

import Modal from './Modal';
import Button from './ModalButton';

interface ModalProps {
  isOpen: boolean;
  setter: (isOpen: boolean) => void;
  content: string;
  callback: () => void;
}

const ContentWrapper = styled.div`
  display: flex;
  height: 100%;
  align-items: center;
`;

const ButtonWrapper = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-evenly;
`;

const ConfirmModal = (props: ModalProps) => {
  const { isOpen, setter, content, callback } = props;

  const closeModal = () => setter(false);
  return (
    <Modal isOpen={isOpen} setter={setter}>
      <ContentWrapper>{content}</ContentWrapper>
      <ButtonWrapper>
        <Button onClick={callback}>네</Button>
        <Button onClick={closeModal}>아니오</Button>
      </ButtonWrapper>
    </Modal>
  );
};

export default ConfirmModal;
