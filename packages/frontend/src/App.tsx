import React, { useState, useCallback } from 'react';
import {
  BrowserRouter,
  Switch,
  Route,
  Link,
  Redirect,
  useHistory,
} from 'react-router-dom';
import './App.css';

import styled from '@cyfm/styled';
import logo from './assets/images/upscale.png';

import ListPage from './pages/ListPage';
import LoginPage from './pages/LoginPage';
import DebugPage from './pages/DebugPage';
import WritePage from './pages/WritePage';
import TopNavLink from './components/TopNavLink';

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

const checkLogin = () => {
  return document.cookie.includes('isLogin');
};

const App: React.FC = () => {
  const history = useHistory();
  const [isLogin, setLogin] = useState(checkLogin());

  const logout = useCallback(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/logout`, {
      credentials: 'include',
      method: 'POST',
    })
      .then(res => res.json())
      .then(res => {
        if (res.message !== 'success') {
          alert('로그인 상태를 확인해주세요');
        }
      })
      .finally(() => setLogin(checkLogin()));
  }, []);

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
              <TopNavLink to="/" onClick={logout}>
                로그아웃
              </TopNavLink>
            ) : (
              <TopNavLink to="/login">로그인</TopNavLink>
            )}
          </Nav>
        </Header>
        <Switch>
          <Route path="/" exact component={ListPage} />
          <Route path="/login" exact component={LoginPage} />
          <Route path="/debug/:id" component={DebugPage} />
          <Route path="/write" exact component={WritePage} />
          <Redirect path="*" to="/notfound" />
        </Switch>
      </BrowserRouter>
    </div>
  );
};

export default App;
