import React from 'react';
import Modal from 'react-modal';

import styled from '@cyfm/styled';

import spinner from 'assets/images/loading.gif';

interface ModalProps {
  isOpen: boolean;
}

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: space-evenly;
  align-items: center;
  overflow: hidden;
`;

const TextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
  align-items: center;
`;

const LoadingModal = (props: ModalProps) => {
  const { isOpen } = props;
  return (
    <Modal
      isOpen={isOpen}
      shouldFocusAfterRender={false}
      style={{
        overlay: {
          position: 'fixed',
          background: 'rgba(0,0,0,0.5)',
          zIndex: 99,
        },
        content: {
          display: 'flex',
          margin: 'auto',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          width: '200px',
          height: '200px',
          borderRadius: '15px',
          backgroundColor: '#f6cb01',
          boxShadow: '0 0 0 6px black, 0 0 0 12px #f6cb01',
          boxSizing: 'border-box',
          fontSize: '1.5em',
        },
      }}
    >
      <ContentWrapper>
        <img src={spinner} alt="loading" />
      </ContentWrapper>
      <TextWrapper>Loading...</TextWrapper>
    </Modal>
  );
};

export default LoadingModal;
