import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { nanoid } from 'nanoid';

import styled from '@cyfm/styled';

import logo from 'assets/images/logo.svg';

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

interface Problem {
  problem_id: number;
  problem_title: string;
  problem_category: string;
  problem_level: number;
  problem_codeId: string;
  problem_authorId: number;
  count: string;
}

interface Statistics {
  problemCount: number;
  submitCount: number;
  userCount: number;
  mostSubmitProblems: Problem[];
  mostCorrectProblems: Problem[];
  mostWrongProblems: Problem[];
}

const convertNum = (num: string) => {
  let length = num.length;
  const result: string[] = [];
  while (length > 3) {
    result.unshift(num.slice(length - 3, length));
    length -= 3;
  }
  result.unshift(num.slice(0, length));

  return result.join(',');
};

const IntroPage = () => {
  const [problemCount, setProblemCount] = useState('0');
  const [submitCount, setSubmitCount] = useState('0');
  const [userCount, setUserCount] = useState('0');
  const [mostSubmitProblems, setSubmitProblems] = useState<Problem[]>([]);
  const [mostCorrectProblems, setCorrectProblems] = useState<Problem[]>([]);
  const [mostWrongProblems, setWrongProblems] = useState<Problem[]>([]);

  const incEvent = useCallback(
    (
      target: number,
      time: number,
      setter: React.Dispatch<React.SetStateAction<string>>,
    ) => {
      const limit =
        Math.round(target / 100) >= Math.floor(target / 100)
          ? Math.round(target / 100)
          : Math.floor(target / 100);
      const incNum =
        target / (time / 100) > limit ? target / (time / 100) : limit;
      const interval = window.setInterval(() => {
        setter(prevState =>
          convertNum(
            Math.floor(
              parseInt(prevState.replace(',', ''), 10) + incNum,
            ).toString(),
          ),
        );
      }, time / 10);

      setTimeout(() => {
        setter(convertNum(target.toString()));
        window.clearInterval(interval);
      }, time);
    },
    [],
  );

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/statistics`)
      .then(res => res.json())
      .then(
        ({
          problemCount,
          submitCount,
          userCount,
          mostSubmitProblems,
          mostCorrectProblems,
          mostWrongProblems,
        }: Statistics) => {
          incEvent(problemCount, 1000, setProblemCount);
          incEvent(submitCount, 1000, setSubmitCount);
          incEvent(userCount, 1000, setUserCount);

          setSubmitProblems(mostSubmitProblems);
          setCorrectProblems(mostCorrectProblems);
          setWrongProblems(mostWrongProblems);
        },
      );
  }, [incEvent]);

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
        <MessageWrapper>
          개발을 하면서 버그를 잡느라 시간을 낭비한 경험이 있으신가요?
        </MessageWrapper>
        <MessageWrapper>
          누구나 개발을 하면서 다양한 버그를 맞닥뜨리게 되는데요,
        </MessageWrapper>
        <MessageWrapper>
          혼자 디버깅을 하면서 버그를 고치는 것도 좋지만
        </MessageWrapper>
        <MessageWrapper>
          버그를 찾아내고 해결하는 과정을 서로 공유할 수 있다면,
        </MessageWrapper>
        <MessageWrapper>
          혹은 다른 사람이 마주친 버그를 내가 해결해볼 수 있다면,
        </MessageWrapper>
        <MessageWrapper>더욱 값진 경험이 되지 않을까요?</MessageWrapper>
        <TitleWrapper>
          코딩은 직접 부딪히고 경험해야 실력이 향상 된다고 합니다!
        </TitleWrapper>
      </MainTextWrapper>
      <ContextWrapper>
        <CardWrapper>
          <TitleWrapper>
            <MessageWrapper>지금까지</MessageWrapper>
            <MessageWrapper>가입한 회원 수</MessageWrapper>
          </TitleWrapper>
          <TextWrapper>
            <MessageWrapper>{userCount} 명</MessageWrapper>
          </TextWrapper>
        </CardWrapper>
        <CardWrapper>
          <TitleWrapper>
            <MessageWrapper>지금까지</MessageWrapper>
            <MessageWrapper>제출된 문제 수</MessageWrapper>
          </TitleWrapper>
          <TextWrapper>
            <MessageWrapper>{problemCount} 개</MessageWrapper>
          </TextWrapper>
        </CardWrapper>
        <CardWrapper>
          <TitleWrapper>
            <MessageWrapper>지금까지</MessageWrapper>
            <MessageWrapper>제출된 코드 수</MessageWrapper>
          </TitleWrapper>
          <TextWrapper>
            <MessageWrapper>{submitCount} 회</MessageWrapper>
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
              {mostCorrectProblems.map((value, index) => {
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
              {mostWrongProblems.map((value, index) => {
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
              {mostSubmitProblems.map((value, index) => {
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
    </IntroWrapper>
  );
};

export default IntroPage;
