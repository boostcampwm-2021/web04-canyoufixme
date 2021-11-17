/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useRef, useCallback, useEffect } from 'react';
import type { MutableRefObject, RefObject } from 'react';
import { useRouteMatch } from 'react-router-dom';

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
  box-sizing: border-box;
`;

const EditorWrapper = styled.div`
  display: flex;
  flex-basis: 50%;
  box-sizing: border-box;
`;

const ConsoleWrapper = styled.div`
  padding: 20px;
  height: 100%;
  flex-basis: 50%;
  background: #24262a;
  color: white;
  box-sizing: border-box;
`;

const ButtonFooter = styled.div`
  display: flex;
  justify-content: space-evenly;
  background: #1c1d20;
`;

const DebugPage: React.FC = () => {
  let socket: Socket<DefaultEventsMap, DefaultEventsMap>;
  const [, setContent] = useState('');
  const [initCode, setInitCode] = useState('');
  const [code, setCode] = useState('');
  const [testCode, setTestCode] = useState([]);

  const viewerRef: MutableRefObject<Viewer | undefined> = useRef();
  const editorRef: MutableRefObject<(AceEditor & Ace.Editor) | undefined> =
    useRef();

  const match = useRouteMatch<{ id: string }>('/debug/:id');
  const id = match?.params.id;
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
      console.log(res);
      return res;
      // 성공 시 실행되는 부분
    } catch (err) {
      // fetch(결과값 저장) 에러 시 실행되는 부분
      console.log(err);
      return err;
    }
  };

  const onSubmit = useCallback(async () => {
    socket = io(`${process.env.REACT_APP_API_URL}`);
    socket.on('connect', () => {
      console.log(socket.id);
    });

    socket.emit('submit', {
      code: (editorRef.current as Ace.Editor).getValue() as string,
      testCode,
    });

    socket.once('result', async result => {
      await requestSubmit(result);
    });

    socket.once('error', error => {
      // socket(채점) 에러 처리
      console.log(error);
    });

    socket.emit('forceDisconnect');
  }, [testCode]);

  const onExecute = useCallback(async () => {
    const result = await runner({
      code: (editorRef.current as Ace.Editor).getValue() as string,
      testCode,
    });
    switch (result.type) {
      case 'init':
        return;
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

  return (
    <EditorPage
      left={
        <>
          <ViewerWrapper>
            <FullWidthViewer
              theme="dark"
              ref={viewerRef as RefObject<FullWidthViewer>}
            />
          </ViewerWrapper>
          ,
          <ConsoleWrapper>
            <div>{output}</div>
          </ConsoleWrapper>
        </>
      }
      right={
        <>
          <EditorWrapper>
            <AceEditor
              onLoad={onLoad}
              onChange={onChange}
              mode="javascript"
              width="100%"
              height="800px"
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
        </>
      }
    />
  );
};

export default DebugPage;
