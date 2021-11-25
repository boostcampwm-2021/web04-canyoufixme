import React from 'react';

import styled from '@cyfm/styled';

import FullWidthDiv from 'components/FullWidthDiv';

interface TestCase {
  title: string;
  code: string;
  id: string;
}

interface ViewerProps {
  testCases: TestCase[];
  remove: (id: string) => void;
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
`;

const TextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 90%;
  height: 100%;
`;

const DeleteButton = styled.button`
  display: block;
  background-color: #f6cc00;
  align-self: center;
  margin: auto;
  padding: 2rem 1rem;
  border: 0;
  border-radius: 5px;
  font-size: 1.5rem;
`;

const TestCaseTitle = styled(FullWidthDiv)`
  color: white;
  background-color: grey;
  margin-bottom: 0.25rem;
`;

const TestCaseCode = styled(FullWidthDiv)`
  color: white;
  background-color: black;
  margin-top: 0.25rem;
`;

const TestCodeViewer = (props: ViewerProps) => {
  return (
    <>
      {props.testCases.map(testcase => {
        return (
          <Wrapper key={testcase.id}>
            <TextWrapper>
              <TestCaseTitle>{testcase.title}</TestCaseTitle>
              <TestCaseCode>{testcase.code}</TestCaseCode>
            </TextWrapper>
            <DeleteButton
              onClick={(e: MouseEvent) => props.remove(testcase.id)}
            >
              -
            </DeleteButton>
          </Wrapper>
        );
      })}
    </>
  );
};

export default TestCodeViewer;
