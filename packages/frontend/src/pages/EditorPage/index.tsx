import { useState, useCallback, useEffect } from 'react';

import styled from '@cyfm/styled';

const minWidth = 250;
const controllerWidth = 5;

const FlexWrapper = styled.div`
  display: flex;
  min-width: 100vw;
  min-height: calc(100vh - 80px);
`;

const LeftFlexColumnWrapper = styled.div<{ width: number }>`
  display: flex;
  flex-direction: column;
  flex-basis: ${props => props.width}px;
  min-width: ${minWidth}px;
  min-height: 100%;
`;

const RightFlexColumnWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  min-width: ${minWidth}px;
  min-height: 100%;
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
    },
    [leftPaneWidth],
  );

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
