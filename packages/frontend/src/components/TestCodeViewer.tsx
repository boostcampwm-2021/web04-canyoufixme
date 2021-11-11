import React from 'react';

import styled from '@cyfm/styled';

import Button from 'components/Button';

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
  flex-direction: column;
  width: 100%;
  margin-bottom: 15px;
`;

const TestCaseTitle = styled.div`
  border: 0;
  border-radius: 5px;
  font-size: 1.2em;
  padding: 10px;
  width: 100%;
  color: white;
  background-color: grey;
  margin-bottom: 15px;
`;

const TestCaseCode = styled.div`
  border: 0;
  border-radius: 5px;
  font-size: 1.2em;
  padding: 10px;
  width: 100%;
  color: white;
  background-color: black;
  margin-bottom: 15px;
`;

const TestCodeViewer = (props: ViewerProps) => {
  return (
    <>
      {props.testCases.map(testcase => {
        return (
          <Wrapper key={testcase.id}>
            <TestCaseTitle>{testcase.title}</TestCaseTitle>
            <TestCaseCode>{testcase.code}</TestCaseCode>
            <Button onClick={(e: MouseEvent) => props.remove(testcase.id)}>
              -
            </Button>
          </Wrapper>
        );
      })}
    </>
  );
};

export default TestCodeViewer;
