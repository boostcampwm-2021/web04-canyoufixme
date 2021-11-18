import React, { useState, useRef, useCallback } from 'react';
import { Editor } from '@toast-ui/react-editor';
import AceEditor from 'react-ace';
import { Ace } from 'ace-builds';
import type { MutableRefObject, RefObject } from 'react';
import { Redirect } from 'react-router-dom';

import { useLogin } from 'hooks/useLogin';

import 'ace-builds/src-noconflict/theme-twilight';

import '@toast-ui/editor/dist/toastui-editor.css';
import '@toast-ui/editor/dist/theme/toastui-editor-dark.css';

import styled from '@cyfm/styled';
import Button from 'components/Button';
import EditorPage from 'pages/EditorPage';
import TestCodeEditor from 'components/TestCodeEditor';
import FullWidthInput from 'components/FullWidthInput';

interface TestCase {
  title: string;
  code: string;
  id: string;
}

const CodeEditorWrapper = styled.div`
  flex-basis: 60%;
  width: 100%;
`;

const TestCodeWrapper = styled.div`
  flex: 1 1 0;
  width: 100%;
  background: #353737;
  padding: 15px;
  overflow-x: hidden;
  overflow-y: auto;
`;

const ButtonFooter = styled.div`
  display: flex;
  justify-content: space-evenly;
  background: #1c1d20;
`;

const TitleInput = styled(FullWidthInput)`
  color: white;
  border-radius: 0;
  background-color: inherit;
`;

const WritePage = () => {
  const [isLogin] = useLogin();
  const [content, setContent] = useState('');
  const [code, setCode] = useState('');

  const titleInputRef: MutableRefObject<HTMLInputElement | undefined> =
    useRef();
  const markdownRef: MutableRefObject<Editor | undefined> = useRef();
  const editorRef: MutableRefObject<(AceEditor & Ace.Editor) | undefined> =
    useRef();

  const [testCases, setTestCases]: [
    TestCase[],
    React.Dispatch<React.SetStateAction<TestCase[]>>,
  ] = useState<TestCase[]>([]);

  const onChange = useCallback(setCode, [setCode]);

  const onLoad = useCallback(
    editor => {
      editorRef.current = editor;
    },
    [editorRef],
  );

  function onMarkdownEditorLoad(this: Editor) {
    markdownRef.current = this;
  }

  const submit = async (e: MouseEvent) => {
    const payload = {
      code: code,
      content: (markdownRef.current as Editor).getInstance().getMarkdown(),
      testCode: [...testCases].map(({ code }) => code),
      title: titleInputRef.current?.value,
      level: 2,
      category: 'JavaScript',
    };

    await fetch(`${process.env.REACT_APP_API_URL}/api/problem`, {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  };

  return (
    <>
      {isLogin ? (
        <EditorPage
          leftPane={
            <>
              <TitleInput
                ref={titleInputRef}
                placeholder="제목을 입력해주세요"
              />
              <Editor
                previewStyle="vertical"
                height="100%"
                initialEditType="wysiwyg"
                hideModeSwitch
                placeholder="### 마크다운 문법에 맞춰 값을 입력해주세요."
                theme="dark"
                usageStatistics={false}
                onLoad={onMarkdownEditorLoad}
                ref={markdownRef as RefObject<Editor>}
              />
            </>
          }
          rightPane={
            <>
              <CodeEditorWrapper>
                <AceEditor
                  onLoad={onLoad}
                  onChange={onChange}
                  mode="javascript"
                  width="100%"
                  height="100%"
                  theme="twilight"
                  name="test"
                  fontSize={16}
                  editorProps={{ $blockScrolling: true }}
                />
              </CodeEditorWrapper>
              <TestCodeWrapper>
                <TestCodeEditor
                  testCases={testCases}
                  setTestCases={setTestCases}
                />
              </TestCodeWrapper>
              <ButtonFooter>
                <Button>실행</Button>
                <Button onClick={submit}>제출</Button>
              </ButtonFooter>
            </>
          }
        />
      ) : (
        <Redirect to="/login" />
      )}
    </>
  );
};

export default WritePage;
