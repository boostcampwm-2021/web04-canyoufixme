import React from 'react';

import styled from '@cyfm/styled';

import Button from 'components/Button';
import FullWidthInput from 'components/FullWidthInput';

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

const TestCaseTitle = styled(FullWidthInput)`
  color: white;
  background-color: grey;
  margin-bottom: 15px;
`;

const TestCaseCode = styled(FullWidthInput)`
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
            <TestCaseTitle value={testcase.title} readonly />
            <TestCaseCode value={testcase.code} readonly />
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
