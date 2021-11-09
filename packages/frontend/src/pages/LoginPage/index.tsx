import React from 'react';
import styled from '@cyfm/styled';

import GitHubLoginButton from '../../components/GitHubLoginButton';

const LoginPageWrapper = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  margin-top: 25px;
`;

const LoginPage = () => {
  return (
    <LoginPageWrapper>
      <GitHubLoginButton />
    </LoginPageWrapper>
  );
};

export default LoginPage;
