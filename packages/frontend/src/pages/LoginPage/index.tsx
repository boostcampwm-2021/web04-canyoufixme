import React, { useCallback } from 'react';
import styled from '@cyfm/styled';

import GitHubLoginButton from '../../components/GitHubLoginButton';

const LoginPageWrapper = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  margin-top: 25px;
`;

const LoginPage = () => {
  const login = useCallback(() => {
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${process.env.REACT_APP_CLIENT_ID}&scope=read:user,user:email`;
  }, []);

  return (
    <LoginPageWrapper>
      <GitHubLoginButton onClick={login} />
    </LoginPageWrapper>
  );
};

export default LoginPage;
