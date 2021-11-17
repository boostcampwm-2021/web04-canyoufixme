import React from 'react';

import styled from '@cyfm/styled';

import Modal from './Modal';
import Button from './ModalButton';

interface ModalProps {
  isOpen: boolean;
  setter: (isOpen: boolean) => void;
  logout: () => void;
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

const LogoutModal = (props: ModalProps) => {
  const { isOpen, setter, logout } = props;

  const closeModal = () => setter(false);
  return (
    <Modal isOpen={isOpen} setter={setter}>
      <ContentWrapper>로그아웃 하시겠습니까?</ContentWrapper>
      <ButtonWrapper>
        <Button onClick={logout}>네</Button>
        <Button onClick={closeModal}>아니오</Button>
      </ButtonWrapper>
    </Modal>
  );
};

export default LogoutModal;
