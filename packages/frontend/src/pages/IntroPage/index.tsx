import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useReducer,
  MutableRefObject,
} from 'react';
import { Link } from 'react-router-dom';
import { nanoid } from 'nanoid';

import styled from '@cyfm/styled';
import type { IProblem } from '@cyfm/types';

import MessageModal from 'components/Modal/MessageModal';

import { IntroReducer, modalReducer } from './reducer';
import logo from 'assets/images/logo.svg';
import { DATA_LOAD_FAIL_MESSAGE, INTRO_MESSAGE } from './message';

const IntroWrapper = styled.div`
  display: flex;
  margin: 3rem auto;
  padding: 1em;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  border-radius: 15px;
  width: 80vw;
  height: 100%;
  background-color: #f6cb01;
  box-shadow: 0 0 0 6px black, 0 0 0 12px #f6cb01;
  box-sizing: border-box;
  font-size: 1.5em;
`;

const ImageWrapper = styled.div`
  display: flex;
  margin-bottom: 1em;
  justify-content: center;
  width: 20%;
  background-color: gray;
  box-shadow: 0 0 0 3px white, 0 0 0 6px black;
  border-radius: 15px;
`;

const MainTitleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0.5em 0;
  width: 100%;
  justify-content: center;
  align-items: center;
`;

const MainTextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 12em;
  justify-content: space-evenly;
  align-items: center;
`;

const ContextWrapper = styled.div`
  display: flex;
  flex-direction: row;
  margin: 0.5em 0;
  width: 100%;
  justify-content: space-evenly;
`;

const CardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  margin: 1em;
  width: 15em;
  height: 15em;
  border: 5px black solid;
  border-radius: 20px;
`;

const TitleWrapper = styled.div`
  font-size: 1.2em;
  font-weight: bold;
  text-align: center;
`;

const TextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 2em;
`;

const MessageWrapper = styled.div`
  text-align: center;
`;

const RankWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const RankItemWrapper = styled.div`
  display: flex;
  width: 100%;
  flex-direction: row;
  align-items: center;
`;

const DebugRank = styled.div`
  display: inline-block;
  margin-right: 1em;
  font-size: 0.5em;
  font-weight: bold;
`;

const DebugLink = styled(Link)`
  display: inline-block;
  margin: 0.2em 0;
  font-size: 0.5em;
  text-decoration: none;
  color: black;
  font-weight: bold;
`;

type ProblemStatistics = {
  [k in keyof IProblem as `problem_${k}`]: IProblem[k];
};

interface Statistics {
  problemCount: number;
  submitCount: number;
  userCount: number;
  mostSubmitProblems: ProblemStatistics[];
  mostCorrectProblems: ProblemStatistics[];
  mostWrongProblems: ProblemStatistics[];
}

const IntroPage = () => {
  const [isLoad, setLoad] = useState(false);
  const [message, setMessage] = useState('');
  const [introState, dispatch] = useReducer(IntroReducer, {
    problemCount: '0',
    targetProblemCount: 0,
    submitCount: '0',
    targetSubmitCount: 0,
    userCount: '0',
    targetUserCount: 0,
    mostSubmitProblems: [],
    mostCorrectProblems: [],
    mostWrongProblems: [],
  });
  const [modalStates, modalDispatch] = useReducer(modalReducer, {
    openMessage: false,
  });

  const incRef: MutableRefObject<HTMLDivElement | undefined> = useRef();
  const ioRef: MutableRefObject<IntersectionObserver | undefined> = useRef();

  const incEvent = useCallback((target: number, time: number, key: string) => {
    const limit =
      Math.round(target / 100) >= Math.floor(target / 100)
        ? Math.round(target / 100)
        : Math.floor(target / 100);
    const incNum =
      target / (time / 100) > limit ? target / (time / 100) : limit;

    const interval = window.setInterval(() => {
      dispatch({
        type: 'incValue',
        payload: {
          key: key,
          value: incNum,
        },
      });
    }, time / 10);

    setTimeout(() => {
      dispatch({
        type: 'setValue',
        payload: {
          key: key,
          value: target.toString(),
        },
      });
      window.clearInterval(interval);
    }, time);
  }, []);

  const ioOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.7,
  };

  ioRef.current = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        incEvent(introState.targetProblemCount, 1000, 'problemCount');
        incEvent(introState.targetSubmitCount, 1000, 'submitCount');
        incEvent(introState.targetUserCount, 1000, 'userCount');

        observer.unobserve(entry.target);
      }
    });
  }, ioOptions);

  const getStatistics = useCallback(async () => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/statistics`,
      );

      if (res.status !== 200) {
        setMessage(DATA_LOAD_FAIL_MESSAGE);
        modalDispatch({
          type: 'open',
          payload: { target: 'message' },
        });
      } else {
        const json = await res.json();
        const {
          problemCount,
          submitCount,
          userCount,
          mostSubmitProblems,
          mostCorrectProblems,
          mostWrongProblems,
        } = json as Statistics;

        dispatch({
          type: 'setValue',
          payload: {
            key: 'targetProblemCount',
            value: problemCount,
          },
        });
        dispatch({
          type: 'setValue',
          payload: {
            key: 'targetSubmitCount',
            value: submitCount,
          },
        });
        dispatch({
          type: 'setValue',
          payload: {
            key: 'targetUserCount',
            value: userCount,
          },
        });

        dispatch({
          type: 'setValue',
          payload: {
            key: 'mostSubmitProblems',
            value: mostSubmitProblems,
          },
        });
        dispatch({
          type: 'setValue',
          payload: {
            key: 'mostCorrectProblems',
            value: mostCorrectProblems,
          },
        });
        dispatch({
          type: 'setValue',
          payload: {
            key: 'mostWrongProblems',
            value: mostWrongProblems,
          },
        });
        setLoad(true);
      }
    } catch (err) {
      setMessage(DATA_LOAD_FAIL_MESSAGE);
      modalDispatch({
        type: 'open',
        payload: { target: 'message' },
      });
    }
  }, []);

  useEffect(() => {
    getStatistics();
  }, [getStatistics]);

  useEffect(() => {
    if (isLoad) ioRef.current?.observe(incRef.current as HTMLDivElement);
  }, [isLoad]);

  return (
    <IntroWrapper>
      <MainTitleWrapper>
        <ImageWrapper>
          <img src={logo} alt="logo" />
        </ImageWrapper>
        <TitleWrapper>개발자를 위한 디버깅 훈련 플랫폼</TitleWrapper>
        <TitleWrapper>
          "<i>Canyoufixme</i>" 입니다!
        </TitleWrapper>
      </MainTitleWrapper>
      <MainTextWrapper>
        {INTRO_MESSAGE.split('\n').map(message => (
          <MessageWrapper>{message}</MessageWrapper>
        ))}
        <TitleWrapper>
          코딩은 직접 부딪히고 경험해야 실력이 향상 된다고 합니다!
        </TitleWrapper>
      </MainTextWrapper>
      <ContextWrapper ref={incRef}>
        <CardWrapper>
          <TitleWrapper>
            <MessageWrapper>지금까지</MessageWrapper>
            <MessageWrapper>가입한 회원 수</MessageWrapper>
          </TitleWrapper>
          <TextWrapper>
            <MessageWrapper>{introState.userCount} 명</MessageWrapper>
          </TextWrapper>
        </CardWrapper>
        <CardWrapper>
          <TitleWrapper>
            <MessageWrapper>지금까지</MessageWrapper>
            <MessageWrapper>제출된 문제 수</MessageWrapper>
          </TitleWrapper>
          <TextWrapper>
            <MessageWrapper>{introState.problemCount} 개</MessageWrapper>
          </TextWrapper>
        </CardWrapper>
        <CardWrapper>
          <TitleWrapper>
            <MessageWrapper>지금까지</MessageWrapper>
            <MessageWrapper>제출된 코드 수</MessageWrapper>
          </TitleWrapper>
          <TextWrapper>
            <MessageWrapper>{introState.submitCount} 회</MessageWrapper>
          </TextWrapper>
        </CardWrapper>
      </ContextWrapper>
      <ContextWrapper>
        <CardWrapper>
          <TitleWrapper>
            <MessageWrapper>제일 많이 맞은</MessageWrapper>
            <MessageWrapper>문제 TOP 5</MessageWrapper>
          </TitleWrapper>
          <TextWrapper>
            <RankWrapper>
              {introState.mostCorrectProblems.map((value, index) => {
                const { problem_codeId, problem_title } = value;
                return (
                  <RankItemWrapper key={nanoid()}>
                    <DebugRank>{index + 1}.</DebugRank>
                    <DebugLink to={`/debug/${problem_codeId}`}>
                      {problem_title}
                    </DebugLink>
                  </RankItemWrapper>
                );
              })}
            </RankWrapper>
          </TextWrapper>
        </CardWrapper>
        <CardWrapper>
          <TitleWrapper>
            <MessageWrapper>제일 많이 틀린</MessageWrapper>
            <MessageWrapper>문제 TOP 5</MessageWrapper>
          </TitleWrapper>
          <TextWrapper>
            <RankWrapper>
              {introState.mostWrongProblems.map((value, index) => {
                const { problem_codeId, problem_title } = value;
                return (
                  <RankItemWrapper key={nanoid()}>
                    <DebugRank>{index + 1}.</DebugRank>
                    <DebugLink to={`/debug/${problem_codeId}`}>
                      {problem_title}
                    </DebugLink>
                  </RankItemWrapper>
                );
              })}
            </RankWrapper>
          </TextWrapper>
        </CardWrapper>
        <CardWrapper>
          <TitleWrapper>
            <MessageWrapper>제일 많이 시도한</MessageWrapper>
            <MessageWrapper>문제 TOP 5</MessageWrapper>
          </TitleWrapper>
          <TextWrapper>
            <RankWrapper>
              {introState.mostSubmitProblems.map((value, index) => {
                const { problem_codeId, problem_title } = value;
                return (
                  <RankItemWrapper key={nanoid()}>
                    <DebugRank>{index + 1}.</DebugRank>
                    <DebugLink to={`/debug/${problem_codeId}`}>
                      {problem_title}
                    </DebugLink>
                  </RankItemWrapper>
                );
              })}
            </RankWrapper>
          </TextWrapper>
        </CardWrapper>
      </ContextWrapper>
      <MessageModal
        isOpen={modalStates.openMessage}
        setter={modalDispatch}
        target={'message'}
        message={message}
        close={true}
      />
    </IntroWrapper>
  );
};

export default IntroPage;
