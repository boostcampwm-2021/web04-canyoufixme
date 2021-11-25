import styled from '@cyfm/styled';
import LoginButton from '../LoginButton';

import { ReactComponent as GitHub } from './github.svg';
import { ReactComponent as Octocat } from './octocat.svg';

interface ButtonProps {
  onClick?: Function;
  children?: string;
}

const size = 25;
const StyledOctocat = styled(Octocat)`
  width: ${size}px;
  height: auto;
  margin-left: 15px;
  fill: white;
`;

const StyledGitHub = styled(GitHub)`
  height: ${size}px;
  width: auto;
  margin-left: 10px;
  fill: white;
`;

const StyledGitHubButton = styled(LoginButton)`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5em;
  font-weight: bold;
  background: #111;
  color: white;
`;

const GitHubButton = (props: ButtonProps) => {
  return (
    <StyledGitHubButton {...props}>
      {props.children ?? (
        <>
          {'Sign in with'}
          <StyledOctocat />
          <StyledGitHub />
        </>
      )}
    </StyledGitHubButton>
  );
};

export default GitHubButton;
