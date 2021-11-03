import React, { useRef } from 'react';
import type { MutableRefObject, RefObject } from 'react';

import AceEditor from 'react-ace';
import { Viewer } from '@toast-ui/react-editor';

import styled from '@cyfm/styled';

import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/theme-xcode';
import '@toast-ui/editor/dist/toastui-editor.css';
import '@toast-ui/editor/dist/theme/toastui-editor-dark.css';
import Editor from '@toast-ui/editor';

class FullWidthViewer extends Viewer {
  componentDidMount(this: { rootEl: RefObject<HTMLElement> }) {
    Viewer.prototype.componentDidMount?.call(this);
    this.rootEl.current?.style.setProperty('width', '100%');
    this.rootEl.current?.style.setProperty('background-color', '#2F333C');
  }
}


const DebugPage: React.FC = () => {
  const viewerRef: MutableRefObject<Viewer | undefined> = useRef();
  const editorRef: MutableRefObject<AceEditor | string | undefined> = useRef();

  function onChange(newValue: string) {
    editorRef.current = newValue;
  }

  function onClick() {
    viewerRef.current?.getInstance().setMarkdown('### 마크다운 예시');
  }

  function getValue() {
    return editorRef.current;
  }

  function onExecute() {
    const func = new Function(getValue() as string);
    func();
  }

  const FlexWrapper = styled.div`
    display: flex;
    min-width: 100%;
  `;

  const FlexColumnWrapper = styled.div`
    display: flex;
    flex-direction: column;
    width: 50%;
  `;

  const ViewerWrapper = styled.div`
    display: flex;
    flex-basis: 50%;
    width: 50%;
    overflow-y: auto;
    padding: 1em;
  `;

  class FullWidthViewer extends Viewer {
    componentDidMount() {
      Viewer.prototype.componentDidMount?.call(this);
    }
  }

  const ConsoleWrapper = styled.div`
    display: inline-block;
  `;

  const EditorWrapper = styled.div`
    display: flex;
    flex-basis: 50%;
  `;

  const Button = styled.button`
    padding: 0.8em 1.2em;
    font-size: 1.2em;
    background-color: yellow;
    border-radius: 15px;
  `;

  const ButtonFooter = styled.div`
    display: flex;
    justify-content: space-evenly;
  `;

  return (
    <FlexWrapper>
      <FlexColumnWrapper>
        <ViewerWrapper>
          <FullWidthViewer
            initialValue={`#### 코드를 작성했는데 생각한대로 동작하지 않아요\n\n고쳐주실수 있을까요? 😥\n\n\`\`\`getTypeName([]) === 'array'\`\`\`?`}
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
            onChange={onChange}
            mode="javascript"
            theme="xcode"
            name="test"
            editorProps={{ $blockScrolling: true }}
          />
        </EditorWrapper>
        <ButtonFooter>
          <Button onClick={onClick}>출력</Button>
          <Button onClick={onExecute}>실행</Button>
        </ButtonFooter>
      </FlexColumnWrapper>
    </FlexWrapper>
  );
};

export default DebugPage;
