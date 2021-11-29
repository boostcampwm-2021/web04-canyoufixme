import React, { useState, useCallback, useRef } from 'react';
import type { MutableRefObject } from 'react';
import { nanoid } from 'nanoid';
import Button from 'components/Button';
import styled from '@cyfm/styled';

import TestCodeViewer from './TestCodeViewer';
import MessageModal from 'components/Modal/MessageModal';

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
  margin: 15px 0;
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

const TitleInput = styled(StyledInput)``;
const TestCodeInput = styled(StyledInput)``;

const TestCodeEditor = ({
  testCases,
  setTestCases,
}: {
  testCases: TestCase[];
  setTestCases: React.Dispatch<React.SetStateAction<TestCase[]>>;
}) => {
  const [isMessage, setMessage] = useState(false);
  const [messages, setMessages] = useState<string>('');
  const titleRef: MutableRefObject<HTMLInputElement | undefined> = useRef();
  const codeRef: MutableRefObject<HTMLInputElement | undefined> = useRef();

  const inputValidation = (title: string, code: string) => {
    if (title.length === 0) {
      setMessages('테스트케이스 제목을 입력해주세요.');
      return false;
    }

    if (code.length === 0) {
      setMessages('테스트케이스 코드를 입력해주세요.');
      return false;
    }

    return true;
  };

  const addTestCase = useCallback(() => {
    const titleInput = titleRef.current as HTMLInputElement;
    const codeInput = codeRef.current as HTMLInputElement;

    const title = titleInput.value;
    const code = codeInput.value;

    if (inputValidation(title, code)) {
      const id = nanoid();

      setTestCases(testCases => [...testCases, { title, code, id }]);

      titleInput.value = '';
      codeInput.value = '';
    } else {
      setMessage(true);
    }
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
      <MessageModal
        isOpen={isMessage}
        setter={setMessage}
        message={messages}
        close={true}
      />
      <TestCodeViewer testCases={testCases} remove={remove} />
      <TestCaseWrapper>
        <TitleWrapper>
          <TitleInput
            ref={titleRef}
            type="text"
            placeholder="제목을 입력해주세요"
            required
          />
        </TitleWrapper>
        <TestCodeInput
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
