import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  useContext,
} from 'react';
import { Editor } from '@toast-ui/react-editor';

import 'ace-builds';
import 'ace-builds/webpack-resolver';
import type { Ace } from 'ace-builds';
import AceEditor from 'react-ace';
import type { MutableRefObject, RefObject } from 'react';
import { Redirect, useHistory } from 'react-router-dom';

import { LoginContext } from 'contexts/LoginContext';
import { useBlockUnload } from 'hooks/useBlockUnload';

import 'ace-builds/src-noconflict/theme-twilight';

import '@toast-ui/editor/dist/toastui-editor.css';
import '@toast-ui/editor/dist/theme/toastui-editor-dark.css';

import styled from '@cyfm/styled';
import Button from 'components/Button';
import EditorPage from 'pages/EditorPage';
import TestCodeEditor from 'components/TestCodeEditor';
import FullWidthInput from 'components/FullWidthInput';
import MessageModal from 'components/Modal/MessageModal';
import ConfirmModal from 'components/Modal/ConfirmModal';
import LoadingModal from 'components/Modal/LoadingModal';

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
  const history = useHistory();

  const { isLogin } = useContext(LoginContext);
  const [code, setCode] = useState('');
  const [isLoading, setLoading] = useState(false);
  const [isSubmit, setSubmit] = useState(false);
  const [isSuccess, setSuccess] = useState(false);
  const [isError, setError] = useState(false);

  useBlockUnload(code);
  useEffect(() => {
    if (history.location.state) {
      const code = (history.location.state as { deps?: string })?.deps ?? '';
      if (code) {
        setCode(code);
      }
    }
  }, [history]);

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

  const submit = async () => {
    const payload = {
      code: code,
      content: (markdownRef.current as Editor).getInstance().getMarkdown(),
      testCode: [...testCases].map(({ code }) => code),
      title: titleInputRef.current?.value,
      level: 2,
      category: 'JavaScript',
    };

    try {
      setLoading(true);
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/problem`, {
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify(payload),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setLoading(false);
      if (res.status === 201) {
        setSuccess(true);
        setTimeout(() => {
          history.push('/');
        }, 2000);
      } else {
        setError(true);
      }
    } catch (err) {
      setError(true);
    }
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
                  value={code}
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
                <Button
                  onClick={() => {
                    setSubmit(true);
                  }}
                >
                  제출
                </Button>
              </ButtonFooter>
              <LoadingModal isOpen={isLoading} />
              <ConfirmModal
                isOpen={isSubmit}
                setter={setSubmit}
                messages={[
                  '제출 후에는 내용을',
                  '변경할 수 없습니다.',
                  '정말로 제출하시겠습니까?',
                ]}
                callback={() => {
                  setSubmit(false);
                  submit();
                }}
              />
              <MessageModal
                isOpen={isSuccess}
                setter={setSuccess}
                messages={[
                  '문제 제출에 성공했습니다.',
                  '잠시 후 문제 리스트로 이동합니다.',
                ]}
                close={false}
              />
              <MessageModal
                isOpen={isError}
                setter={setError}
                messages={['출제에 실패했습니다.', '담당자에게 문의 바랍니다.']}
                close={true}
              />
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
