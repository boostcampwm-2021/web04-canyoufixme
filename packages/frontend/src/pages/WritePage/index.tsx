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
import { useSandbox } from 'hooks/useSandbox';
import { useBlockUnload } from 'hooks/useBlockUnload';
import {
  VALIDATION_FAIL_MESSAGE,
  LANGUAGE_SELECTIONS,
  VALID_LANGUAGES,
} from './constant';

import 'ace-builds/src-noconflict/theme-twilight';
import 'ace-builds/src-noconflict/mode-c_cpp';
import 'ace-builds/src-noconflict/mode-java';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/mode-python';

import '@toast-ui/editor/dist/toastui-editor.css';
import '@toast-ui/editor/dist/theme/toastui-editor-dark.css';

import styled from '@cyfm/styled';
import Button from 'components/Button';
import Console from 'components/Console';
import WriteEditorPage from 'pages/WriteEditorPage';
import TestCodeEditor from 'components/TestCodeEditor';
import FullWidthInput from 'components/FullWidthInput';
import MessageModal from 'components/Modal/MessageModal';
import ConfirmModal from 'components/Modal/ConfirmModal';
import LoadingModal from 'components/Modal/LoadingModal';
import SelectModal from 'components/Modal/SelectModal';

interface TestCase {
  title: string;
  code: string;
  id: string;
}

enum Category {
  'C++',
  'Java',
  'JavaScript',
  'Python',
}

const CATEGORY = {
  'C++': 'c_cpp',
  Java: 'java',
  JavaScript: 'javascript',
  Python: 'python',
};

const TABSIZE = {
  'C++': 2,
  Java: 2,
  JavaScript: 2,
  Python: 4,
};

const CategoryLevelWrapper = styled.div`
  display: flex;
  flex-direction: row;
`;

const CategoryWrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: 50%;
`;

const LevelWrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: 50%;
`;

const TagLabel = styled.div`
  width: 50%;
  color: white;
  font-size: 1em;
  text-align: center;
  align-self: center;
  cursor: default;
`;

const TagButton = styled(Button)`
  width: 50%;
  font-size: 1em;
  text-align: center;
`;

const ConsoleWrapper = styled.div``;

const CodeEditorWrapper = styled.div`
  flex-basis: 100%;
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

const GuidelineButton = styled.button`
  font-size: 1em;
  width: 1.5em;
  height: 1.5em;
  margin: 0.5em;
  background-color: #f6cc00;
  border: 1px solid black;
  border-radius: 15px;
`;

const WritePage = () => {
  const history = useHistory();

  const { isLogin } = useContext(LoginContext);
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [category, setCategory] = useState('JavaScript');
  const [level, setLevel] = useState('1');
  const [isOpenCategory, setOpenCategory] = useState(false);
  const [isOpenLevel, setOpenLevel] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [isSubmit, setSubmit] = useState(false);
  const [isSuccess, setSuccess] = useState(false);
  const [isError, setError] = useState(false);
  const [isValid, setValid] = useState(false);
  const [isValidLang, setValidLang] = useState(false);
  const [validationMessages, setValidationMessages] = useState<string[]>([]);

  const unblockRef = useRef(false);
  useBlockUnload(code, unblockRef);

  useEffect(() => {
    if (history.location.state) {
      const code = (history.location.state as { deps?: string })?.deps ?? '';
      if (code) {
        setCode(code);
      }
    }
  }, [history]);

  useEffect(() => {
    setCode('');
  }, [category]);

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

  const onExecute = useSandbox(code, dispatcher => {
    console.clear();
    setOutput('');
    const logConsole = (message: string) =>
      setOutput(prev => `${prev}\n${message}`.trim());

    logConsole('[실행 시작...]');
    const startTime = Date.now();

    const loadTimer = setTimeout(() => {
      setLoading(true);
    }, 500);

    const timeout = 5 * 1000;
    const killTimer = setTimeout(() => {
      logConsole('TimeoutError: timeout 5s');
      dispatcher.dispatchEvent(new CustomEvent('kill'));
    }, timeout);

    dispatcher.addEventListener('stdout', (event: CustomEventInit) => {
      logConsole(event.detail);
    });
    dispatcher.addEventListener('stderr', (event: CustomEventInit) => {
      logConsole(event.detail);
    });
    dispatcher.addEventListener(
      'exit',
      (event: CustomEventInit) => {
        clearTimeout(killTimer);
        clearTimeout(loadTimer);
        setLoading(false);

        const endTime = Date.now();
        setOutput(prev =>
          `${prev}\n\n[실행 완료: ${endTime - startTime}ms]`.trim(),
        );
      },
      { once: true },
    );
  });

  function onMarkdownEditorLoad(this: Editor) {
    markdownRef.current = this;
  }

  const inputValidation = useCallback(() => {
    const titleContext = titleInputRef.current?.value;
    if ((titleContext as string).length === 0) {
      setValidationMessages(VALIDATION_FAIL_MESSAGE['title']);
      return false;
    }

    const markdownContext = (markdownRef.current as Editor)
      .getInstance()
      .getMarkdown();
    if ((markdownContext as string).length === 0) {
      setValidationMessages(VALIDATION_FAIL_MESSAGE['markdown']);
      return false;
    }

    const codeContext = code;
    if ((codeContext as string).length === 0) {
      setValidationMessages(VALIDATION_FAIL_MESSAGE['code']);
      return false;
    }

    const testcaseContext = testCases;
    if (testcaseContext.length === 0) {
      setValidationMessages(VALIDATION_FAIL_MESSAGE['testcase']);
      return false;
    }

    return true;
  }, [code, testCases]);

  const isValidLanguage = useCallback(() => {
    if (VALID_LANGUAGES.includes(category)) {
      return true;
    } else {
      return false;
    }
  }, [category]);

  const submitValidation = () => {
    if (isValidLanguage()) {
      if (inputValidation()) {
        setSubmit(true);
      } else {
        setValid(true);
      }
    } else {
      setValidLang(true);
    }
  };

  const submit = async () => {
    const payload = {
      code: code,
      content: (markdownRef.current as Editor).getInstance().getMarkdown(),
      testCode: [...testCases].map(({ code }) => code),
      title: titleInputRef.current?.value,
      level: parseInt(level, 10),
      category: category,
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
        unblockRef.current = true;
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
        <WriteEditorPage
          leftPane={
            <>
              <TitleInput
                ref={titleInputRef}
                placeholder="제목을 입력해주세요"
              />
              <Editor
                previewStyle="vertical"
                height="60%"
                initialEditType="wysiwyg"
                hideModeSwitch
                placeholder="마크다운 문법에 맞춰 값을 입력해주세요."
                theme="dark"
                usageStatistics={false}
                onLoad={onMarkdownEditorLoad}
                ref={markdownRef as RefObject<Editor>}
              />
              <ConsoleWrapper>
                <Console value={output} readOnly />
              </ConsoleWrapper>
            </>
          }
          middlePane={
            <>
              <CodeEditorWrapper>
                <CategoryLevelWrapper>
                  <SelectModal
                    isOpen={isOpenCategory}
                    setter={setOpenCategory}
                    value={category}
                    changeValue={setCategory}
                    selections={LANGUAGE_SELECTIONS}
                    close={true}
                  />
                  <SelectModal
                    isOpen={isOpenLevel}
                    setter={setOpenLevel}
                    value={level}
                    changeValue={setLevel}
                    selections={['1', '2', '3']}
                    close={true}
                  />
                  <CategoryWrapper>
                    <TagLabel>카테고리</TagLabel>
                    <TagButton onClick={() => setOpenCategory(true)}>
                      {category}
                    </TagButton>
                  </CategoryWrapper>
                  <LevelWrapper>
                    <TagLabel>난이도</TagLabel>
                    <TagButton onClick={() => setOpenLevel(true)}>
                      {level}
                    </TagButton>
                  </LevelWrapper>
                </CategoryLevelWrapper>
                <AceEditor
                  onLoad={onLoad}
                  onChange={onChange}
                  mode={CATEGORY[category as keyof typeof CATEGORY]}
                  width="100%"
                  theme="twilight"
                  name="code"
                  value={code}
                  fontSize={16}
                  tabSize={TABSIZE[category as keyof typeof TABSIZE]}
                  editorProps={{ $blockScrolling: true }}
                />
              </CodeEditorWrapper>
            </>
          }
          rightPane={
            <>
              <TestCodeWrapper>
                <GuidelineButton
                  onClick={() => {
                    window.open(
                      '/guide',
                      '테스트케이스 가이드라인',
                      'width=1000px, height=500px',
                    );
                  }}
                >
                  ?
                </GuidelineButton>
                <TestCodeEditor
                  testCases={testCases}
                  setTestCases={setTestCases}
                />
              </TestCodeWrapper>
              <ButtonFooter>
                <Button onClick={onExecute}>실행</Button>
                <Button onClick={submitValidation}>제출</Button>
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
                isOpen={isValid}
                setter={setValid}
                messages={validationMessages}
                close={true}
              />
              <MessageModal
                isOpen={isValidLang}
                setter={setValidLang}
                messages={[
                  '현재는 지원하지 않는 언어입니다.',
                  '빠른 시일 내에 지원하겠습니다.',
                  '현재 사용 가능 언어 : JavaScript',
                ]}
                close={true}
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
