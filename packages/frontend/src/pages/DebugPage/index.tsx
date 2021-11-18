/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useRef, useCallback, useEffect } from 'react';
import type { MutableRefObject, RefObject } from 'react';
import { useRouteMatch, useHistory } from 'react-router-dom';

import AceEditor from 'react-ace';
import { Ace } from 'ace-builds';
import type { Viewer } from '@toast-ui/react-editor';

import babelParser from 'prettier/parser-babel';
import prettier from 'prettier/standalone';

import runner from './debug';
import styled from '@cyfm/styled';
import FullWidthViewer from 'components/FullWidthViewer';

import EditorPage from 'pages/EditorPage';
import Button from 'components/Button';
import MessageModal from 'components/Modal/MessageModal';
import ConfirmModal from 'components/Modal/ConfirmModal';
import LoadingModal from 'components/Modal/LoadingModal';

import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/theme-twilight';
import '@toast-ui/editor/dist/toastui-editor.css';
import '@toast-ui/editor/dist/theme/toastui-editor-dark.css';

import io, { Socket } from 'socket.io-client';
import { DefaultEventsMap } from '@socket.io/component-emitter';

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

let socket: Socket<DefaultEventsMap, DefaultEventsMap>;

const DebugPage: React.FC = () => {
  const [, setContent] = useState('');
  const [initCode, setInitCode] = useState('');
  const [code, setCode] = useState('');
  const [testCode, setTestCode] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [isSuccess, setSuccess] = useState(false);
  const [isFail, setFail] = useState(false);
  const [isError, setError] = useState(false);

  const viewerRef: MutableRefObject<Viewer | undefined> = useRef();
  const editorRef: MutableRefObject<(AceEditor & Ace.Editor) | undefined> =
    useRef();

  const match = useRouteMatch<{ id: string }>('/debug/:id');
  const id = match?.params.id;

  useEffect(() => {
    socket = io(`${process.env.REACT_APP_API_URL}`);

    socket.on('result', async result => {
      await requestSubmit(result);
      setLoading(false);
      if (checkResult(result)) {
        setSuccess(true);
      } else {
        setFail(true);
      }
    });

    socket.on('error', error => {
      setError(true);
    });
  }, []);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/debug/${id}`)
      .then(res => res.json())
      .then(({ content, code, testCode }) => {
        const prettierCode = prettier.format(code, {
          singleQuote: true,
          semi: true,
          tabWidth: 2,
          trailingComma: 'all',
          arrowParens: 'avoid',
          parser: 'babel',
          plugins: [babelParser],
        });
        setContent(content);
        setInitCode(prettierCode);
        setCode(prettierCode);
        setTestCode(testCode);
        viewerRef.current?.getInstance().setMarkdown(content);
      });
  }, [id]);

  const [output, setOutput] = useState('');

  const onChange = useCallback(setCode, [setCode]);

  const onLoad = useCallback(
    editor => {
      editorRef.current = editor;
    },
    [editorRef],
  );

  const checkResult = (result: string[]) => {
    return result.every(value => value === 'success');
  };

  const requestSubmit = async (result: [string]) => {
    const payload = {
      problemCodeId: id,
      testResult: result,
      code: code,
    };

    try {
      let res = await fetch(`${process.env.REACT_APP_API_URL}/api/submit`, {
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify(payload),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      res = await res.json();
      return res;
    } catch (err) {
      setError(true);
      return err;
    }
  };

  const onSubmit = useCallback(async () => {
    setLoading(true);

    socket.emit('submit', {
      code: (editorRef.current as Ace.Editor).getValue() as string,
      id,
    });
  }, [testCode]);

  const onExecute = useCallback(async () => {
    const loadTimer = setTimeout(() => {
      setLoading(true);
    }, 500);

    const result = await runner({
      code: (editorRef.current as Ace.Editor).getValue() as string,
      testCode,
    });

    clearTimeout(loadTimer);
    setLoading(false);

    switch (result.type) {
      case 'success':
        setOutput('축하합니다. 멋지게 해내셨네요! 🥳');
        break;
      case 'error':
        setOutput((result.payload as { message: string }).message);
        break;
    }
  }, [testCode, editorRef, setOutput]);

  const initializeCode = useCallback(() => {
    const editor = editorRef.current as Ace.Editor;
    editor.setValue(initCode);
    editor.focus();
    editor.clearSelection();
  }, [initCode]);

  const history = useHistory();

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
            <div>{output}</div>
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
              value={code}
              editorProps={{ $blockScrolling: true }}
              setOptions={{
                tabSize: 2,
                enableBasicAutocompletion: true,
                enableLiveAutocompletion: true,
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
          />
          <MessageModal
            isOpen={isError}
            setter={setError}
            messages={['제출에 실패했습니다.', '담당자에게 문의 바랍니다.']}
          />
        </>
      }
    />
  );
};

export default DebugPage;
