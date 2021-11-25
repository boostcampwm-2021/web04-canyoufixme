import { useState, useCallback, useEffect, useRef } from 'react';
// eslint-disable-next-line import/no-webpack-loader-syntax
import syncWorkerUrl from 'worker-plugin/loader?sharedWorker!./sync.worker';
import styled from '@cyfm/styled';

const minWidth = 250;
const controllerWidth = 5;

const FlexWrapper = styled.div`
  display: flex;
  min-width: 100vw;
  min-height: calc(100vh - 80px);
`;

const ColumnWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-width: ${minWidth}px;
  min-height: 100%;
`;

const LeftFlexColumnWrapper = styled<{ width: number }>(ColumnWrapper)`
  flex-basis: ${props => props.width}px;
`;

const RightFlexColumnWrapper = styled(ColumnWrapper)`
  flex-grow: 1;
`;

const FlexColumnController = styled.div`
  display: inline-block;
  width: ${controllerWidth}px;
  background-color: #999;
  border-color: #444;
  border-style: solid;
  border-top: 2px;
  border-bottom: 2px;
  cursor: col-resize;
`;

interface SlotProps {
  leftPane: React.ReactNode;
  rightPane: React.ReactNode;
}

const EditorPage = (props: SlotProps) => {
  const syncWorkerRef = useRef<SharedWorker>();
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [leftPaneWidth, setLeftPaneWidth] = useState(
    localStorage.getItem('leftPaneWidth') ??
      (window.innerWidth - controllerWidth) / 2,
  );

  const onControllerMouseDown = useCallback((event: MouseEvent): void => {
    setIsMouseDown(true);
  }, []);

  const onControllerMouseMove = useCallback(
    (event: MouseEvent): void => {
      if (isMouseDown) {
        setLeftPaneWidth(event.pageX - controllerWidth / 2);
      }
    },
    [isMouseDown],
  );

  const onControllerMouseUp = useCallback(
    (event: MouseEvent): void => {
      setIsMouseDown(false);
      localStorage.setItem('leftPaneWidth', String(leftPaneWidth));
      syncWorkerRef.current?.port.postMessage(
        `DATA${JSON.stringify({
          type: 'editorWidth',
          payload: { width: leftPaneWidth },
        })}`,
      );
    },
    [leftPaneWidth],
  );

  useEffect(() => {
    syncWorkerRef.current = new SharedWorker(syncWorkerUrl);
    const syncWorker = syncWorkerRef.current;

    const receivedMessage = (event: MessageEvent) => {
      switch (event.data) {
        case 'PING':
          syncWorker?.port.postMessage('PONG');
          break;
        default:
          if (event.data.startsWith('DATA')) {
            const data = JSON.parse(event.data.substring('DATA'.length));
            if (data.type === 'editorWidth') {
              setLeftPaneWidth(data.payload.width);
            }
          }
          break;
      }
    };

    syncWorker?.port.addEventListener('message', receivedMessage);
    syncWorker?.port.start();
    syncWorker?.port.postMessage('PING');

    return () =>
      syncWorker?.port.removeEventListener('message', receivedMessage);
  }, []);

  return (
    <>
      <FlexWrapper
        onMouseMove={onControllerMouseMove}
        onMouseUp={onControllerMouseUp}
      >
        <LeftFlexColumnWrapper width={parseInt(String(leftPaneWidth), 10)}>
          {props.leftPane}
        </LeftFlexColumnWrapper>
        <FlexColumnController onMouseDown={onControllerMouseDown} />
        <RightFlexColumnWrapper width={leftPaneWidth}>
          {props.rightPane}
        </RightFlexColumnWrapper>
      </FlexWrapper>
    </>
  );
};

export default EditorPage;
