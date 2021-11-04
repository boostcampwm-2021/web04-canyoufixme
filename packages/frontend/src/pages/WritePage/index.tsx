import React, { useRef } from 'react';
import { Editor } from '@toast-ui/react-editor';
import AceEditor from 'react-ace';
import type { MutableRefObject, RefObject } from 'react';

import 'ace-builds/src-noconflict/theme-twilight';

import '@toast-ui/editor/dist/toastui-editor.css';
import '@toast-ui/editor/dist/theme/toastui-editor-dark.css';

const WritePage = () => {
  const markdownRef: MutableRefObject<Editor | undefined> = useRef();

  function onMarkdownEditorLoad(this: Editor) {
    markdownRef.current = this;
  }

  return (
    <>
      <Editor
        previewStyle="vertical"
        height="400px"
        initialEditType="wysiwyg"
        hideModeSwitch
        placeholder="### 마크다운 문법에 맞춰 값을 입력해주세요."
        theme="dark"
        usageStatistics={false}
        onLoad={onMarkdownEditorLoad}
        ref={markdownRef as RefObject<Editor>}
      />
      <AceEditor
        mode="javascript"
        theme="twilight"
        name="test"
        editorProps={{ $blockScrolling: true }}
      />
    </>
  );
};

export default WritePage;
