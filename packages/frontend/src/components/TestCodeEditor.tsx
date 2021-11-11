import React, { useState, useCallback, useRef } from 'react';
import type { MutableRefObject, RefObject } from 'react';
import { nanoid } from 'nanoid';
import Button from 'components/Button';
import styled from '@cyfm/styled';

import TestCodeViewer from './TestCodeViewer';

interface TestCase {
  title: string;
  code: string;
  id: string;
}

const FlexWrapper = styled.div`
  display: flex;
`;

const FullWidthWrapper = styled(FlexWrapper)`
  width: 100%;
`;

const Wrapper = styled(FullWidthWrapper)`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const TitleWrapper = styled(FullWidthWrapper)`
  margin-bottom: 15px;
`;

const TestCaseWrapper = styled(FullWidthWrapper)`
  margin-bottom: 15px;
  flex-direction: column;
`;

const StyledInput = styled.input`
  border: 0;
  border-radius: 5px;
  font-size: 1.2em;
  padding: 15px;
  flex-basis: 100%;
`;

const TestCodeEditor = ({
  testCases,
  setTestCases,
}: {
  testCases: TestCase[];
  setTestCases: React.Dispatch<React.SetStateAction<TestCase[]>>;
}) => {
  const titleRef: MutableRefObject<HTMLInputElement | undefined> = useRef();
  const codeRef: MutableRefObject<HTMLInputElement | undefined> = useRef();

  const addTestCase = useCallback(() => {
    const titleInput = titleRef.current as HTMLInputElement;
    const codeInput = codeRef.current as HTMLInputElement;

    const title = titleInput.value;
    const code = codeInput.value;
    const id = nanoid();

    setTestCases(testCases => [...testCases, { title, code, id }]);

    titleInput.value = '';
    codeInput.value = '';
  }, [titleRef, codeRef, setTestCases]);

  const remove = useCallback(
    (id: string) => {
      setTestCases(cases => {
        return cases.filter(({ id: caseId }) => caseId !== id);
      });
    },
    [setTestCases],
  );

  return (
    <Wrapper>
      <TestCodeViewer testCases={testCases} remove={remove} />
      <TestCaseWrapper>
        <TitleWrapper>
          <StyledInput
            ref={titleRef}
            type="text"
            placeholder="제목을 입력해주세요"
            required
          />
        </TitleWrapper>
        <StyledInput
          ref={codeRef}
          type="text"
          placeholder="테스트 코드를 입력해주세요"
          required
        />
      </TestCaseWrapper>
      <Button onClick={addTestCase}>+</Button>
    </Wrapper>
  );
};

export default TestCodeEditor;
