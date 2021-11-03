import React, { useRef } from 'react';
import AceEditor from 'react-ace';
import type { MutableRefObject } from 'react';

import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/theme-xcode';

const DebugPage: React.FC = () => {
  const editorRef: MutableRefObject<AceEditor | string | undefined> = useRef();

  function onChange(newValue: string) {
    editorRef.current = newValue;
  }

  function onClick() {
    console.log(editorRef.current);
  }

  function onExecute() {
    const func = new Function(editorRef.current as string);
    func();
  }

  return (
    <div>
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
