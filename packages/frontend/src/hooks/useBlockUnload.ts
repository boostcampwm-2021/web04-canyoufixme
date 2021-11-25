import { useRef, useEffect } from 'react';
import type { MutableRefObject } from 'react';
import { useHistory } from 'react-router-dom';

const CONFIRM_MESSAGE = `작성 중인 내용이 사라집니다\n\n페이지를 나가시거나 새로고침 하시겠습니까?`;
export const useBlockUnload = <T>(
  dependencies: T,
  unblockRef: MutableRefObject<boolean> | null,
  didChange = (prev: T, deps: T) => !Object.is(prev, deps),
) => {
  const history = useHistory();
  const historyRef = useRef<string>('');
  const prevRef = useRef<T>(dependencies);

  useEffect(() => {
    const blockUnload = (event: BeforeUnloadEvent) => {
      if (!unblockRef?.current) {
        event.preventDefault();
        return (event.returnValue = CONFIRM_MESSAGE);
      }
    };

    const confirmBeforeGo = () => {
      if (!unblockRef?.current && !window.confirm(CONFIRM_MESSAGE)) {
        history.push(historyRef.current, {
          prev: prevRef.current,
          deps: dependencies,
        });
      }
    };

    if (!historyRef.current) {
      historyRef.current = history.location.pathname;
    }

    if (prevRef.current) {
      if (didChange(prevRef.current, dependencies)) {
        // 새로고침 방지
        window.addEventListener('beforeunload', blockUnload);
        // 앞/뒤로가기 방지
        window.addEventListener('popstate', confirmBeforeGo);
        // 라우팅 방지
        const unlisten = history.listen((location, action) => {
          if (action === 'PUSH' && location.pathname !== historyRef.current) {
            confirmBeforeGo();
          }
        });

        return () => {
          window.removeEventListener('beforeunload', blockUnload);
          window.removeEventListener('popstate', confirmBeforeGo);
          unlisten();
        };
      }
    } else {
      prevRef.current = dependencies;
    }
  }, [unblockRef, history, historyRef, prevRef, didChange, dependencies]);
};
