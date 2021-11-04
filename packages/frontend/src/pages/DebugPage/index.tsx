import React, { useState, useRef, useCallback, useEffect } from 'react';
import type { MutableRefObject, RefObject } from 'react';
import { useRouteMatch } from 'react-router-dom';

import AceEditor from 'react-ace';
import { Ace } from 'ace-builds';
import { Viewer } from '@toast-ui/react-editor';

import babelParser from 'prettier/parser-babel';
import prettier from 'prettier/standalone';

import runner from './debug';
import styled from '@cyfm/styled';

import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/theme-twilight';
import '@toast-ui/editor/dist/toastui-editor.css';
import '@toast-ui/editor/dist/theme/toastui-editor-dark.css';

class FullWidthViewer extends Viewer {
  componentDidMount(this: { rootEl: RefObject<HTMLElement> }) {
    Viewer.prototype.componentDidMount?.call(this);
    this.rootEl.current?.style.setProperty('width', '100%');
    this.rootEl.current?.style.setProperty('background-color', '#2F333C');
  }
}

const FlexWrapper = styled.div`
  display: flex;
  min-width: 100vw;
  min-height: 100vh;
`;

const FlexColumnWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex-basis: 100%;
  width: 50%;
`;

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

const Button = styled.button`
  padding: 0.5em 0.7em;
  border: 0;
  font-size: 1.2em;
  background-color: #f6cc00;
`;

const ButtonFooter = styled.div`
  display: flex;
  justify-content: space-evenly;
  background: #1c1d20;
`;

const DebugPage: React.FC = () => {
  const [, setContent] = useState('');
  const [code, setCode] = useState('');
  const [testCode, setTestCode] = useState('');

  const viewerRef: MutableRefObject<Viewer | undefined> = useRef();
  const editorRef: MutableRefObject<(AceEditor & Ace.Document) | undefined> =
    useRef();

  const match = useRouteMatch<{ id: string }>('/debug/:id');
  const id = match?.params.id;
  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/debug/${id}`)
      .then(res => res.json())
      .then(({ content, code, testCode }) => {
        setContent(content);
        setCode(
          prettier.format(code, {
            singleQuote: true,
            semi: true,
            tabWidth: 2,
            trailingComma: 'all',
            arrowParens: 'avoid',
            parser: 'babel',
            plugins: [babelParser],
          }),
        );
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

  const onExecute = useCallback(async () => {
    if (
      await runner({
        code: (editorRef.current as Ace.Document).getValue() as string,
        setter: setOutput,
        testCode,
      })
    ) {
      setOutput('축하합니다. 멋지게 해내셨네요! 🥳');
    }
  }, [testCode, editorRef, setOutput]);

  return (
    <FlexWrapper>
      <FlexColumnWrapper>
        <ViewerWrapper>
          <FullWidthViewer
            theme="dark"
            ref={viewerRef as RefObject<FullWidthViewer>}
          />
        </ViewerWrapper>
        <ConsoleWrapper>
          <div>{output}</div>
        </ConsoleWrapper>
      </FlexColumnWrapper>
      <FlexColumnWrapper>
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
          <Button onClick={onExecute}>실행</Button>
        </ButtonFooter>
      </FlexColumnWrapper>
    </FlexWrapper>
  );
};

export default DebugPage;
