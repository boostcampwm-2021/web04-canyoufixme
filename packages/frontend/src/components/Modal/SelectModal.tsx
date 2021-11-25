import React from 'react';
import Modal from 'react-modal';
import { nanoid } from 'nanoid';

import styled from '@cyfm/styled';

import Button from './ModalButton';

interface ModalProps {
  isOpen: boolean;
  setter: (isOpen: boolean) => void;
  value: string;
  changeValue: (value: string) => void;
  selections: string[];
  close?: boolean;
}

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: space-evenly;
  align-items: center;
  overflow-y: visible;
`;

const SelectWrapper = styled(Button)`
  display: block;
`;

const SelectedWrapper = styled(Button)`
  display: block;
  border: 3px solid white;
`;

const ButtonWrapper = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-evenly;
`;

const SelectModal = (props: ModalProps) => {
  const { isOpen, setter, value, changeValue, selections } = props;

  const closeModal = () => setter(false);
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={() => setter(false)}
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
          height: '300px',
          borderRadius: '15px',
          backgroundColor: '#f6cb01',
          boxShadow: '0 0 0 6px black, 0 0 0 12px #f6cb01',
          boxSizing: 'border-box',
          fontSize: '1.5em',
        },
      }}
    >
      <ContentWrapper>
        {selections.map(select =>
          value === select ? (
            <SelectedWrapper key={nanoid()}>{select}</SelectedWrapper>
          ) : (
            <SelectWrapper
              key={nanoid()}
              onClick={() => {
                changeValue(select);
              }}
            >
              {select}
            </SelectWrapper>
          ),
        )}
      </ContentWrapper>
      {props.close ? (
        <ButtonWrapper>
          <Button onClick={closeModal}>닫기</Button>
        </ButtonWrapper>
      ) : (
        ''
      )}
    </Modal>
  );
};

export default SelectModal;
