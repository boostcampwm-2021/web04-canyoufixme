import React, { useRef } from 'react';
import AceEditor from 'react-ace';

import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/theme-xcode';

const DebugPage = () => {
  const editorRef = useRef();

  function onChange(newValue) {
    editorRef.current = newValue;
  }

  function onClick() {
    console.log(editorRef.current);
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
    </div>
  );
};

export default DebugPage;
