import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import styled from '@cyfm/styled';

import notfound from 'assets/images/404.png';

const NotFoundWrapper = styled.div`
  display: flex;
  margin: 3rem auto;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
  border-radius: 15px;
  width: 60vw;
  height: 100%;
  background-color: #f6cb01;
  box-shadow: 0 0 0 6px black, 0 0 0 12px #f6cb01;
  box-sizing: border-box;
  font-size: 1.5em;
`;

const ImageWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 20%;
`;

const TextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const TitleWrapper = styled.div`
  font-size: 2em;
  font-weight: bold;
  margin-bottom: 1em;
`;

const ContextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 1em;
`;

const MessageWrapper = styled.div`
  text-align: center;
`;

let countdownTimer: number;

const NotFoundPage = () => {
  const history = useHistory();
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    countdownTimer = window.setInterval(() => {
      setCountdown(prevState => prevState - 1);
    }, 1000);
  }, []);

  useEffect(() => {
    if (countdown === 0) {
      clearInterval(countdownTimer);
      history.push('/');
    }
  }, [history, countdown]);
  return (
    <NotFoundWrapper>
      <ImageWrapper>
        <img src={notfound} alt="404" />
      </ImageWrapper>
      <TextWrapper>
        <TitleWrapper>404 Not Found</TitleWrapper>
        <ContextWrapper>
          <MessageWrapper>잘못된 접근입니다.</MessageWrapper>
          <MessageWrapper>
            {countdown}초 후에 메인 페이지로 이동합니다.
          </MessageWrapper>
        </ContextWrapper>
      </TextWrapper>
    </NotFoundWrapper>
  );
};

export default NotFoundPage;
