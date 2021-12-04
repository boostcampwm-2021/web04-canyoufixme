import React, {
  useEffect,
  useState,
  useRef,
  useReducer,
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
import { modalReducer } from './reducer';
import {
  LANGUAGE_SELECTIONS,
  LEVEL_SELECTIONS,
  VALID_LANGUAGES,
  TIMEOUT_MS,
} from './constant';
import {
  VALIDATION_FAIL_MESSAGE,
  CHECK_BEFORE_SUBMIT_MESSAGE,
  CHECK_IS_VALID_LANGUAGE,
  SUBMIT_SUCCESS_MESSAGE,
  SUBMIT_FAIL_MESSAGE,
  CODE_VALIDATION_TIMEOUT,
  CODE_VALIDATION_FAIL,
  CODE_VALIDATION_MESSAGE,
} from './message';

import chai from 'assets/images/chai.png';
import sinon from 'assets/images/sinon.png';

import 'ace-builds/src-noconflict/theme-twilight';
import 'ace-builds/src-noconflict/mode-c_cpp';
import 'ace-builds/src-noconflict/mode-java';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/mode-python';

import '@toast-ui/editor/dist/toastui-editor.css';
import '@toast-ui/editor/dist/theme/toastui-editor-dark.css';

import styled from '@cyfm/styled';
import { throttlePromise } from '@cyfm/throttle';
import Button from 'components/Button';
import Console from 'components/Console';
import WriteEditorPage from 'pages/WriteEditorPage';
import TestCodeEditor from 'components/TestCodeEditor';
import FullWidthInput from 'components/FullWidthInput';
import MessageModal from 'components/Modal/MessageModal';
import ConfirmModal from 'components/Modal/ConfirmModal';
import LoadingModal from 'components/Modal/LoadingModal';
import SelectModal from 'components/Modal/SelectModal';

import type { ITestCase, Category } from '@cyfm/types';

type Language = keyof typeof Category;

type CodeValidationResult = 'valid' | 'error' | 'timeout';

const CATEGORY: Record<Language, string> = {
  'C++': 'c_cpp',
  Java: 'java',
  JavaScript: 'javascript',
  Python: 'python',
};

const TABSIZE: Record<Language, number> = {
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
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

const ConsoleWrapper = styled.div`
  padding: 20px;
  min-height: 300px;
  background: #24262a;
  color: white;
`;

const CodeEditorWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex-basis: 100%;
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

const GuidelineWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const GuidelineButton = styled.button`
  display: flex;
  justify-content: center;
  font-size: 1em;
  width: 1.5em;
  height: 1.5em;
  margin: 0.5em;
  background-color: #f6cc00;
  border: 1px solid black;
  border-radius: 15px;
`;

const MessageWrapper = styled.div`
  color: white;
  font-size: 1em;
`;

const WritePage = () => {
  let isValidCode: MutableRefObject<CodeValidationResult> = useRef('valid');
  const history = useHistory();

  const { isLogin } = useContext(LoginContext);
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [category, setCategory] = useState<Language>('JavaScript');
  const [level, setLevel] = useState('1');
  const [dummyOutput, setDummyOutput] = useState('');

  const [modalStates, dispatch] = useReducer(modalReducer, {
    openCategory: false,
    openLevel: false,
    openLoading: false,
    openSubmit: false,
    openSuccess: false,
    openValidate: false,
    openMessage: false,
  });

  const [message, setMessage] = useState('');

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
    ITestCase[],
    React.Dispatch<React.SetStateAction<ITestCase[]>>,
  ] = useState<ITestCase[]>([]);

  const onChange = useCallback(setCode, [setCode]);

  const onLoad = useCallback(
    editor => {
      editorRef.current = editor;
    },
    [editorRef],
  );

  const [sandboxRef, console] = useSandbox({
    setter: setOutput,
    dependencies: [
      'https://cdn.jsdelivr.net/npm/chai@4.3.4/chai.js',
      'https://cdn.jsdelivr.net/npm/sinon@12.0.1',
    ],
    timeout: 3000,
    onLoadStart: () =>
      dispatch({ type: 'open', payload: { target: 'loading' } }),
    onLoadEnd: () =>
      dispatch({ type: 'close', payload: { target: 'loading' } }),
  });

  const onExecute = useCallback(() => {
    if (!sandboxRef.current) return;
    console.clear();

    testCases.forEach(test => {
      sandboxRef.current?.dispatchEvent(
        new CustomEvent('exec', {
          detail: `
            const log = console.log;
            console.log = new Function;
            const clock = sinon.useFakeTimers({
              shouldAdvanceTime: true,
            });
            ${code}
            const { expect } = chai;
            ${test.code}
            clock.runAll();
            clock.restore();
          `,
        }),
      );
    });
    sandboxRef.current?.dispatchEvent(
      new CustomEvent('exec', {
        detail: code,
      }),
    );
  }, [sandboxRef, console, code, testCases]);

  function onMarkdownEditorLoad(this: Editor) {
    markdownRef.current = this;
  }

  const [codeValidator, _] = useSandbox({
    setter: setDummyOutput,
    dependencies: ['https://cdn.jsdelivr.net/npm/sinon@12.0.1'],
    timeout: TIMEOUT_MS,
    onLoadStart: () =>
      dispatch({ type: 'open', payload: { target: 'loading' } }),
    onLoadEnd: () =>
      dispatch({ type: 'close', payload: { target: 'loading' } }),
    onError: () => {
      isValidCode.current = 'error';
      setMessage(CODE_VALIDATION_FAIL);
      dispatch({ type: 'open', payload: { target: 'message' } });
    },
    onTimeout: () => {
      isValidCode.current = 'timeout';
      setMessage(CODE_VALIDATION_TIMEOUT);
      dispatch({ type: 'open', payload: { target: 'message' } });
    },
  });

  const codeValidation = useCallback(() => {
    if (!codeValidator.current) return;

    codeValidator.current.addEventListener('idle', () => {
      if (isValidCode.current === 'valid') {
        dispatch({ type: 'open', payload: { target: 'submit' } });
      }
    });

    codeValidator.current?.dispatchEvent(
      new CustomEvent('exec', {
        detail: `
          const log = console.log;
          console.log = new Function;
          const clock = sinon.useFakeTimers({
            shouldAdvanceTime: true,
          });
          ${code}
          clock.runAll();
          clock.restore();
        `,
      }),
    );
  }, [code, codeValidator, isValidCode]);

  const inputValidation = useCallback(() => {
    const titleContext = titleInputRef.current?.value;
    if ((titleContext as string).length === 0) {
      setMessage(VALIDATION_FAIL_MESSAGE['title']);
      return false;
    }

    const markdownContext = (markdownRef.current as Editor)
      .getInstance()
      .getMarkdown();
    if ((markdownContext as string).length === 0) {
      setMessage(VALIDATION_FAIL_MESSAGE['markdown']);
      return false;
    }

    const codeContext = code;
    if ((codeContext as string).length === 0) {
      setMessage(VALIDATION_FAIL_MESSAGE['code']);
      return false;
    }

    const testcaseContext = testCases;
    if (testcaseContext.length === 0) {
      setMessage(VALIDATION_FAIL_MESSAGE['testcase']);
      return false;
    }

    return true;
  }, [code, testCases]);

  const isValidLanguage = useCallback(() => {
    if (VALID_LANGUAGES.includes(category)) {
      return true;
    } else {
      setMessage(CHECK_IS_VALID_LANGUAGE);
      return false;
    }
  }, [category]);

  const submitValidation = () => {
    if (isValidLanguage() && inputValidation()) {
      dispatch({ type: 'open', payload: { target: 'validate' } });
      setTimeout(() => {
        dispatch({
          type: 'close',
          payload: { target: 'validate' },
        });
        codeValidation();
      }, 1000);
      isValidCode.current = 'valid';
    } else {
      dispatch({ type: 'open', payload: { target: 'message' } });
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
      dispatch({ type: 'open', payload: { target: 'loading' } });
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/problem`, {
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify(payload),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      dispatch({ type: 'close', payload: { target: 'loading' } });
      if (res.status === 201) {
        dispatch({ type: 'open', payload: { target: 'success' } });
        unblockRef.current = true;
        setTimeout(() => {
          history.push('/');
        }, 2000);
      } else {
        setMessage(SUBMIT_FAIL_MESSAGE);
        dispatch({ type: 'open', payload: { target: 'message' } });
      }
    } catch (err) {
      setMessage(SUBMIT_FAIL_MESSAGE);
      dispatch({ type: 'open', payload: { target: 'message' } });
    }
  };

  const submitPromise = throttlePromise(submit, 3000);

  const onSubmit = useCallback(submitPromise, [submitPromise]);

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
                height="100%"
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
                    isOpen={modalStates.openCategory}
                    setter={dispatch}
                    target={'category'}
                    value={category}
                    changeValue={setCategory as (value: string) => void}
                    selections={LANGUAGE_SELECTIONS}
                    close={true}
                  />
                  <SelectModal
                    isOpen={modalStates.openLevel}
                    setter={dispatch}
                    target={'level'}
                    value={level}
                    changeValue={setLevel}
                    selections={LEVEL_SELECTIONS}
                    close={true}
                  />
                  <CategoryWrapper>
                    <TagLabel>카테고리</TagLabel>
                    <TagButton
                      onClick={() =>
                        dispatch({
                          type: 'open',
                          payload: { target: 'category' },
                        })
                      }
                    >
                      {category}
                    </TagButton>
                  </CategoryWrapper>
                  <LevelWrapper>
                    <TagLabel>난이도</TagLabel>
                    <TagButton
                      onClick={() =>
                        dispatch({ type: 'open', payload: { target: 'level' } })
                      }
                    >
                      {level}
                    </TagButton>
                  </LevelWrapper>
                </CategoryLevelWrapper>
                <AceEditor
                  onLoad={onLoad}
                  onChange={onChange}
                  mode={CATEGORY[category as keyof typeof CATEGORY]}
                  width="100%"
                  height="100%"
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
                <GuidelineWrapper>
                  <MessageWrapper>테스트 코드 가이드라인 -</MessageWrapper>
                  <GuidelineButton
                    onClick={() => {
                      window.open(
                        '/guide/chai',
                        'Chai 가이드라인',
                        'width=1000px, height=500px',
                      );
                    }}
                  >
                    <img
                      src={chai}
                      alt="chai"
                      title="chai"
                      style={{ width: '1.3em', height: '1.3em' }}
                    />
                  </GuidelineButton>
                  <GuidelineButton
                    onClick={() => {
                      window.open(
                        '/guide/sinon',
                        'Sinon 가이드라인',
                        'width=1000px, height=500px',
                      );
                    }}
                  >
                    <img
                      src={sinon}
                      alt="sinon"
                      title="sinon"
                      style={{ width: '1.2em', height: '1.2em' }}
                    />
                  </GuidelineButton>
                </GuidelineWrapper>
                <TestCodeEditor
                  testCases={testCases}
                  setTestCases={setTestCases}
                />
              </TestCodeWrapper>
              <ButtonFooter>
                <Button onClick={onExecute}>실행</Button>
                <Button onClick={submitValidation}>제출</Button>
              </ButtonFooter>
              <LoadingModal isOpen={modalStates.openLoading} />
              <ConfirmModal
                isOpen={modalStates.openSubmit}
                setter={dispatch}
                target={'submit'}
                message={CHECK_BEFORE_SUBMIT_MESSAGE}
                callback={() => {
                  dispatch({ type: 'close', payload: { target: 'submit' } });
                  onSubmit();
                }}
              />
              <MessageModal
                isOpen={modalStates.openMessage}
                setter={dispatch}
                target={'message'}
                message={message}
                close={true}
              />
              <MessageModal
                isOpen={modalStates.openValidate}
                setter={dispatch}
                target={'validate'}
                message={CODE_VALIDATION_MESSAGE}
                close={false}
              />
              <MessageModal
                isOpen={modalStates.openSuccess}
                setter={dispatch}
                target={'success'}
                message={SUBMIT_SUCCESS_MESSAGE}
                close={false}
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
