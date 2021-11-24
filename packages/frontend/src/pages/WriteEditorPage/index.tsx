import { useState, useCallback, useRef } from 'react';

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

const MiddleFlexColumnWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex-basis: ${props => props.width}px;
  min-width: ${minWidth}px;
  min-height: 100%;
`;

const RightFlexColumnWrapper = styled.div<{ width: number }>`
  display: flex;
  flex-direction: column;
  flex-basis: ${props => props.width}px;
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
  middlePane: React.ReactNode;
  rightPane: React.ReactNode;
}

const EditorPage = (props: SlotProps) => {
  const [isLeftMouseDown, setIsLeftMouseDown] = useState(false);
  const [isRightMouseDown, setIsRightMouseDown] = useState(false);
  const middlePaneWrapper = useRef<HTMLDivElement>();

  const [leftPaneWidth, setLeftPaneWidth] = useState(
    localStorage.getItem('leftPaneWidth') ??
      (window.innerWidth - 2 * controllerWidth) / 3,
  );

  const [rightPaneWidth, setRightPaneWidth] = useState(
    localStorage.getItem('rightPaneWidth') ??
      (window.innerWidth - 2 * controllerWidth) / 3,
  );

  const getNumberValue = (num: string | number) => {
    return Number.isInteger(num)
      ? (num as number)
      : (parseInt(num as string, 10) as number);
  };

  const onLeftControllerMouseDown = useCallback((event: MouseEvent): void => {
    setIsLeftMouseDown(true);
  }, []);

  const onLeftControllerMouseMove = useCallback(
    (event: MouseEvent): void => {
      if (isLeftMouseDown && !isRightMouseDown) {
        const width = event.pageX - controllerWidth / 2;
        const widthLimit =
          window.innerWidth -
          (2 * controllerWidth + minWidth + getNumberValue(rightPaneWidth));

        if (width >= minWidth && width <= widthLimit) {
          setLeftPaneWidth(width);
        }
      }
    },
    [isLeftMouseDown],
  );

  const onLeftControllerMouseUp = useCallback(
    (event: MouseEvent): void => {
      setIsLeftMouseDown(false);
      localStorage.setItem('leftPaneWidth', String(leftPaneWidth));
    },
    [leftPaneWidth],
  );

  const onRightControllerMouseDown = useCallback((event: MouseEvent): void => {
    setIsRightMouseDown(true);
  }, []);

  const onRightControllerMouseMove = useCallback(
    (event: MouseEvent): void => {
      if (isRightMouseDown && !isLeftMouseDown) {
        const width = window.innerWidth - (event.pageX + controllerWidth / 2);
        const widthLimit =
          window.innerWidth -
          (2 * controllerWidth + minWidth + getNumberValue(leftPaneWidth));
        if (width >= minWidth && width <= widthLimit) {
          setRightPaneWidth(width);
        }
      }
    },
    [isRightMouseDown],
  );

  const onRightControllerMouseUp = useCallback(
    (event: MouseEvent): void => {
      setIsRightMouseDown(false);
      localStorage.setItem('rightPaneWidth', String(rightPaneWidth));
    },
    [rightPaneWidth],
  );

  return (
    <>
      <FlexWrapper
        onMouseMove={(event: MouseEvent) => {
          if (isLeftMouseDown && !isRightMouseDown) {
            onLeftControllerMouseMove(event);
          }
          if (isRightMouseDown && !isLeftMouseDown) {
            onRightControllerMouseMove(event);
          }
        }}
        onMouseUp={(event: MouseEvent) => {
          if (isLeftMouseDown && !isRightMouseDown) {
            onLeftControllerMouseUp(event);
          }
          if (isRightMouseDown && !isLeftMouseDown) {
            onRightControllerMouseUp(event);
          }
        }}
      >
        <LeftFlexColumnWrapper width={parseInt(leftPaneWidth as string, 10)}>
          {props.leftPane}
        </LeftFlexColumnWrapper>
        <FlexColumnController onMouseDown={onLeftControllerMouseDown} />
        <MiddleFlexColumnWrapper
          ref={middlePaneWrapper}
          width={
            window.innerWidth -
            (parseInt(leftPaneWidth as string, 10) +
              parseInt(rightPaneWidth as string, 10) +
              2 * controllerWidth)
          }
        >
          {props.middlePane}
        </MiddleFlexColumnWrapper>
        <FlexColumnController onMouseDown={onRightControllerMouseDown} />
        <RightFlexColumnWrapper width={parseInt(rightPaneWidth as string, 10)}>
          {props.rightPane}
        </RightFlexColumnWrapper>
      </FlexWrapper>
    </>
  );
};

export default EditorPage;
