import React from 'react';
import { BrowserRouter, Switch, Route, Link, Redirect } from 'react-router-dom';
import './App.css';

import styled from '@cyfm/styled';
import logo from './assets/images/upscale.png';

import ListPage from './pages/ListPage';
import DebugPage from './pages/DebugPage';
import WritePage from './pages/WritePage';
import NavLinkComponent from './components/NavLinkComponent';

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
  return (
    <div className="App">
      <BrowserRouter>
        <Header>
          <Link to="/">
            <Logo src={logo} alt="canyoufixme logo" />
          </Link>
          <Nav>
            <NavLinkComponent label="홈으로" to="/" />
            <NavLinkComponent label="문제 출제" to="/write" />
          </Nav>
        </Header>
        <Switch>
          <Route path="/" exact component={ListPage} />
          <Route path="/debug/:id" component={DebugPage} />
          <Route path="/write" exact component={WritePage} />
          <Redirect path="*" to="/notfound" />
        </Switch>
      </BrowserRouter>
    </div>
  );
};

export default App;
