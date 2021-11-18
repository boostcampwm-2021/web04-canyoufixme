import React, { useState, useCallback } from 'react';
import styled from '@cyfm/styled';

import GitHubLoginButton from '../../components/GitHubLoginButton';
import LoadingModal from 'components/Modal/LoadingModal';

const LoginPageWrapper = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  margin-top: 25px;
`;

const LoginPage = () => {
  const [isLoading, setLoading] = useState(false);
  const login = useCallback(() => {
    setLoading(true);
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${process.env.REACT_APP_CLIENT_ID}&scope=read:user,user:email`;
  }, []);

  return (
    <LoginPageWrapper>
      <GitHubLoginButton onClick={login} />
      <LoadingModal isOpen={isLoading} />
    </LoginPageWrapper>
  );
};

export default LoginPage;
