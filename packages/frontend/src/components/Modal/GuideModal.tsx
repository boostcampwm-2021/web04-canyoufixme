import React from 'react';
import Modal from 'react-modal';
import { nanoid } from 'nanoid';

import styled from '@cyfm/styled';

import Button from './ModalButton';

import GUIDELINES from './GuidelineCase';

interface ModalProps {
  isOpen: boolean;
  setter: (isOpen: boolean) => void;
  close?: boolean;
}

const ModalWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
`;

const TitleWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
`;

const TitleTextWrapper = styled.div`
  margin-bottom: 1rem;
  text-align: center;
  font-size: 3rem;
  font-weight: bold;
`;

const PageButton = styled(Button)``;

const ContentWrapper = styled.div`
  text-align: center;
  height: 80%;
  overflow-y: auto;
`;

const TestCaseWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 1rem 0;
`;

const TestCaseTitle = styled.div`
  font-size: 2rem;
  font-weight: bold;
`;

const TestCaseContent = styled.div`
  font-size: 1.5rem;
  margin: 10px 0;
`;

const TestCaseCode = styled.div`
  display: flex;
  font-size: 1.5rem;
  font-weight: bold;
  color: white;
  background-color: black;
  margin-bottom: 15px;
  padding: 10px;
  width: 80%;
  border-radius: 5px;
`;

const ButtonWrapper = styled.div`
  display: flex;
  margin-top: 1rem;
  width: 100%;
  justify-content: space-evenly;
`;

const GuideModal = (props: ModalProps) => {
  const { isOpen, setter } = props;

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
          zIndex: 100,
        },
        content: {
          display: 'flex',
          margin: 'auto',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          width: '80vw',
          height: '80vh',
          borderRadius: '15px',
          backgroundColor: '#f6cb01',
          boxShadow: '0 0 0 6px black, 0 0 0 12px #f6cb01',
          boxSizing: 'border-box',
          fontSize: '1.5em',
        },
      }}
    >
      <ModalWrapper>
        <TitleWrapper>
          <TitleTextWrapper>테스트케이스 가이드라인</TitleTextWrapper>
          <PageButton
            onClick={() => {
              window.open(
                '/guide',
                '테스트케이스 가이드라인',
                'width=1000px, height=500px',
              );
            }}
          >
            페이지로 열기
          </PageButton>
        </TitleWrapper>
        <ContentWrapper>
          {GUIDELINES.map(guideline => (
            <TestCaseWrapper key={nanoid()}>
              <TestCaseTitle>{guideline.title}</TestCaseTitle>
              <TestCaseContent>{guideline.content}</TestCaseContent>
              {guideline.codes.map(code => (
                <TestCaseCode>{code}</TestCaseCode>
              ))}
            </TestCaseWrapper>
          ))}
        </ContentWrapper>
        {props.close ? (
          <ButtonWrapper>
            <Button onClick={closeModal}>닫기</Button>
          </ButtonWrapper>
        ) : (
          ''
        )}
      </ModalWrapper>
    </Modal>
  );
};

export default GuideModal;
