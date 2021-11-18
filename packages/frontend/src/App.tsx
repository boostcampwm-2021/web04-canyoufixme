import React, { useState, useCallback } from 'react';
import { BrowserRouter, Switch, Route, Link, Redirect } from 'react-router-dom';
import Modal from 'react-modal';
import { useLogin } from 'hooks/useLogin';
import './App.css';

import styled from '@cyfm/styled';
import logo from 'assets/images/upscale.png';

import ListPage from 'pages/ListPage';
import LoginPage from 'pages/LoginPage';
import DebugPage from 'pages/DebugPage';
import WritePage from 'pages/WritePage';
import EditorPage from 'pages/EditorPage';
import TopNavLink from 'components/TopNavLink';
import MessageModal from 'components/Modal/MessageModal';
import ConfirmModal from 'components/Modal/ConfirmModal';

const Header = styled.header`
  color: white;
  background-color: #1d2122;
  min-height: 80px;
  width: 100%;
  display: flex;
`;

const Nav = styled.nav`
  display: flex;
  margin-left: auto;
  background-color: #1d2122;
  width: 30%;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
`;

const Logo = styled.img`
  max-height: 80px;
  width: auto;
`;

const App: React.FC = () => {
  const [isLogin, setLogin] = useLogin();
  const [isLogoutOpen, setLogoutOpen] = useState(false);
  const [isMessageOpen, setMessageOpen] = useState(false);

  const logout = useCallback(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/logout`, {
      credentials: 'include',
      method: 'POST',
    })
      .then(res => res.json())
      .then(res => {
        if (res.message !== 'success') {
          setMessageOpen(true);
          return;
        }
        setLogin(false);
        setLogoutOpen(false);
      });
  }, [setLogin]);

  const openLogoutModal = useCallback(
    (e: MouseEvent) => {
      e.preventDefault();
      setLogoutOpen(true);
    },
    [setLogoutOpen],
  );

  return (
    <div className="App">
      <BrowserRouter>
        <Header>
          <Link to="/">
            <Logo src={logo} alt="canyoufixme logo" />
          </Link>
          <Nav>
            <TopNavLink to="/">홈으로</TopNavLink>
            <TopNavLink to="/write">문제 출제</TopNavLink>
            {isLogin ? (
              <TopNavLink to="/" onClick={openLogoutModal}>
                로그아웃
              </TopNavLink>
            ) : (
              <TopNavLink to="/login">로그인</TopNavLink>
            )}
          </Nav>
        </Header>
        <ConfirmModal
          isOpen={isLogoutOpen}
          setter={setLogoutOpen}
          messages={['로그아웃 하시겠습니까?']}
          callback={logout}
        />
        <MessageModal
          isOpen={isMessageOpen}
          setter={setMessageOpen}
          messages={['비정상적인 접근입니다.', '로그인 상태를 확인해주세요.']}
          close={true}
        />
        <Switch>
          <Route path="/" exact component={ListPage} />
          <Route path="/login" exact component={LoginPage} />
          <Route path="/debug/:id" component={DebugPage} />
          <Route path="/write" exact component={WritePage} />
          <Route path="/editor" exact component={EditorPage} />
          <Redirect path="*" to="/notfound" />
        </Switch>
      </BrowserRouter>
    </div>
  );
};

Modal.setAppElement('#root');

export default App;
