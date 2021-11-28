import React, {
  useState,
  useReducer,
  useRef,
  useCallback,
  useContext,
  useEffect,
} from 'react';
import type { MutableRefObject, RefObject } from 'react';
import { useRouteMatch, useHistory } from 'react-router-dom';

import 'ace-builds';
import 'ace-builds/webpack-resolver';
import type { Ace } from 'ace-builds';
import AceEditor from 'react-ace';
import type { Viewer } from '@toast-ui/react-editor';

import babelParser from 'prettier/parser-babel';
import prettier from 'prettier/standalone';

import styled from '@cyfm/styled';
import FullWidthViewer from 'components/FullWidthViewer';

import EditorPage from 'pages/EditorPage';
import Button from 'components/Button';
import Console from 'components/Console';
import { LoginContext } from 'contexts/LoginContext';
import MessageModal from 'components/Modal/MessageModal';
import ConfirmModal from 'components/Modal/ConfirmModal';
import LoadingModal from 'components/Modal/LoadingModal';

import { useSandbox } from 'hooks/useSandbox';
import { useBlockUnload } from 'hooks/useBlockUnload';
import { debugReducer } from './reducer';

import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/theme-twilight';
import '@toast-ui/editor/dist/toastui-editor.css';
import '@toast-ui/editor/dist/theme/toastui-editor-dark.css';

const ViewerWrapper = styled.div`
  display: flex;
  flex-basis: 50%;
  width: 100%;
  overflow-y: auto;
`;

const EditorWrapper = styled.div`
  flex-basis: 100%;
`;

const ConsoleWrapper = styled.div`
  padding: 20px;
  height: 100%;
  flex-basis: 50%;
  background: #24262a;
  color: white;
`;

const ButtonFooter = styled.div`
  display: flex;
  flex-basis: 0;
  justify-content: space-evenly;
  background: #1c1d20;
`;

const DebugPage: React.FC = () => {
  const [debugStates, dispatch] = useReducer(debugReducer, {
    initCode: '',
    content: '',
    code: '',
    testCode: [],
  });
  const { isLogin } = useContext(LoginContext);
  const [output, setOutput] = useState('');
  const [isLoading, setLoading] = useState(false);
  const [isSuccess, setSuccess] = useState(false);
  const [isFail, setFail] = useState(false);
  const [isTimeover, setTimeover] = useState(false);
  const [isError, setError] = useState(false);
  const [isLoginCheck, setLoginCheck] = useState(false);
  const history = useHistory();

  const unblockRef = useRef(false);
  useBlockUnload(debugStates, unblockRef, (_, deps) => {
    return deps.initCode !== deps.code;
  });

  const viewerRef: MutableRefObject<Viewer | undefined> = useRef();
  const editorRef: MutableRefObject<(AceEditor & Ace.Editor) | undefined> =
    useRef();

  const match = useRouteMatch<{ id: string }>('/debug/:id');
  const id = match?.params.id;

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/debug/${id}`)
      .then(res => res.json())
      .then(
        ({
          content,
          code,
          testCode,
        }: {
          content: string;
          code: string;
          testCode: string[];
        }) => {
          const prettierCode = prettier.format(code, {
            singleQuote: true,
            semi: true,
            tabWidth: 2,
            trailingComma: 'all',
            arrowParens: 'avoid',
            parser: 'babel',
            plugins: [babelParser],
          });

          dispatch({
            type: 'init',
            payload: {
              code: prettierCode,
              content,
              testCode,
            },
          });

          viewerRef.current?.getInstance().setMarkdown(content);
        },
      );
  }, [id]);

  const onChange = useCallback(
    code => dispatch({ type: 'setCode', payload: { code } }),
    [],
  );

  const onLoad = useCallback(
    editor => {
      editorRef.current = editor;
    },
    [editorRef],
  );

  const onSubmit = useCallback(async () => {
    if (!isLogin) {
      setLoginCheck(true);
      return;
    }

    unblockRef.current = true;
    history.push('/result', {
      code: (editorRef.current as Ace.Editor).getValue() as string,
      testCode: debugStates.testCode,
      problemId: id,
    });
  }, [debugStates.testCode, history, id]);

  const onExecute = useSandbox(debugStates.code, dispatcher => {
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

  const initializeCode = useCallback(() => {
    const editor = editorRef.current as Ace.Editor;
    editor.setValue(debugStates.initCode as string);
    editor.focus();
    editor.clearSelection();

    dispatch({
      type: 'init',
      payload: { ...debugStates, code: debugStates.initCode },
    });
  }, [debugStates]);

  useEffect(() => {
    if (history.location.state) {
      const code =
        (history.location.state as { deps: { code: string } }).deps.code ?? '';
      if (code) {
        dispatch({ type: 'setCode', payload: { code } });
      }
    }
  }, [history]);

  return (
    <EditorPage
      leftPane={
        <>
          <ViewerWrapper>
            <FullWidthViewer
              theme="dark"
              ref={viewerRef as RefObject<FullWidthViewer>}
            />
          </ViewerWrapper>
          <ConsoleWrapper>
            <Console value={output} readOnly />
          </ConsoleWrapper>
        </>
      }
      rightPane={
        <>
          <EditorWrapper>
            <AceEditor
              onLoad={onLoad}
              onChange={onChange}
              mode="javascript"
              width="100%"
              height="100%"
              theme="twilight"
              name="test"
              fontSize={16}
              value={debugStates.code}
              editorProps={{ $blockScrolling: true }}
              setOptions={{
                tabSize: 2,
              }}
            />
          </EditorWrapper>
          <ButtonFooter>
            <Button onClick={initializeCode}>초기화</Button>
            <Button onClick={onExecute}>실행</Button>
            <Button onClick={onSubmit}>제출</Button>
          </ButtonFooter>
          <LoadingModal isOpen={isLoading} />
          <ConfirmModal
            isOpen={isSuccess}
            setter={setSuccess}
            messages={['정답입니다!', '다른 문제를 풀러 가시겠습니까?']}
            callback={() => {
              history.push('/');
            }}
          />
          <MessageModal
            isOpen={isFail}
            setter={setFail}
            messages={['틀렸습니다.', '다시 도전해 보세요!']}
            close={true}
          />
          <MessageModal
            isOpen={isTimeover}
            setter={setTimeover}
            messages={['실행 시간이 5초를 초과했습니다.']}
            close={true}
          />
          <MessageModal
            isOpen={isError}
            setter={setError}
            messages={['제출에 실패했습니다.', '담당자에게 문의 바랍니다.']}
            close={true}
          />
          <MessageModal
            isOpen={isLoginCheck}
            setter={setLoginCheck}
            messages={['문제 풀이 제출을 위해서는', '로그인이 필요합니다.']}
            close={true}
          />
        </>
      }
    />
  );
};

export default DebugPage;
