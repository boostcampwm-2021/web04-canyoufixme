import React, { useRef } from 'react';
import AceEditor from 'react-ace';
import { Editor, Viewer } from '@toast-ui/react-editor';
import type { MutableRefObject, RefObject } from 'react';

import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/theme-xcode';
import '@toast-ui/editor/dist/toastui-editor.css';

const DebugPage: React.FC = () => {
  const markdownRef: MutableRefObject<Editor | undefined> = useRef();
  const viewerRef: MutableRefObject<Viewer | undefined> = useRef();
  const editorRef: MutableRefObject<AceEditor | string | undefined> = useRef();

  function onChange(newValue: string) {
    editorRef.current = newValue;
  }

  function onClick() {
    const markdown = markdownRef.current?.getInstance().getMarkdown() as string;
    viewerRef.current?.getInstance().setMarkdown(markdown);
  }

  function getValue() {
    return editorRef.current;
  }

  function onExecute() {
    const func = new Function(getValue() as string);
    func();
  }

  function onMarkdownEditorLoad(this: Editor) {
    markdownRef.current = this;
  }

  return (
    <div>
      <Editor
        previewStyle="vertical"
        height="400px"
        initialEditType="wysiwyg"
        initialValue="### 마크다운 문법에 맞춰 값을 입력해주세요."
        theme="dark"
        onLoad={onMarkdownEditorLoad}
        ref={markdownRef as RefObject<Editor>}
      />
      <div
        style={{
          width: '200px',
          maxHeight: '300px',
          overflowY: 'auto',
        }}
      >
        <Viewer ref={viewerRef as RefObject<Viewer>} />
      </div>
      <AceEditor
        onChange={onChange}
        mode="javascript"
        theme="xcode"
        name="test"
        editorProps={{ $blockScrolling: true }}
      />
      <button onClick={onClick}>출력</button>
      <button onClick={onExecute}>실행</button>
    </div>
  );
};

export default DebugPage;
