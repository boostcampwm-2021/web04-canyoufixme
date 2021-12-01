import React, {
  useState,
  useCallback,
  useContext,
  useReducer,
  useMemo,
} from 'react';
import { BrowserRouter, Switch, Route, Link, Redirect } from 'react-router-dom';
import Modal from 'react-modal';
import { LoginContext } from 'contexts/LoginContext';
import SocketContext from 'contexts/SocketContext';
import './App.css';

import styled from '@cyfm/styled';
import logo from 'assets/images/upscale.png';

import { ModalReducerAction } from 'components/Modal/ModalType';

import IntroPage from 'pages/IntroPage';
import ListPage from 'pages/ListPage';
import LoginPage from 'pages/LoginPage';
import DebugPage from 'pages/DebugPage';
import ResultPage from 'pages/ResultPage';
import WritePage from 'pages/WritePage';
import EditorPage from 'pages/EditorPage';
import GuidePage from 'pages/GuidePage';
import NotFoundPage from 'pages/NotFoundPage';
import TopNavLink from 'components/TopNavLink';
import MessageModal from 'components/Modal/MessageModal';
import ConfirmModal from 'components/Modal/ConfirmModal';

type ModalState = {
  openLogout: boolean;
  openMessage: boolean;
};

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
  const loginContext = useContext(LoginContext);
  const socketContext = useContext(SocketContext);
  const socket = socketContext.socket;

  const [isLogin, setLogin] = useState(loginContext.isLogin);
  const login = useMemo(() => {
    return {
      isLogin,
      setLogin,
    };
  }, [isLogin]);

  const [modalStates, dispatch] = useReducer(
    (state: ModalState, action: ModalReducerAction): ModalState => {
      const isOpen = action.type === 'open';
      switch (action.payload.target) {
        case 'logout':
          return { ...state, openLogout: isOpen };
        case 'message':
          return { ...state, openMessage: isOpen };
        default:
          return state;
      }
    },
    {
      openLogout: false,
      openMessage: false,
    },
  );

  const logout = useCallback(async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/logout`, {
        credentials: 'include',
        method: 'POST',
      });
      if (res.status !== 200) {
        dispatch({ type: 'open', payload: { target: 'message' } });
      } else {
        dispatch({ type: 'close', payload: { target: 'logout' } });
        setLogin(false);
      }
    } catch (err) {
      dispatch({ type: 'open', payload: { target: 'message' } });
    }
  }, []);

  const openLogoutModal = useCallback(
    (e: MouseEvent) => {
      e.preventDefault();
      dispatch({ type: 'open', payload: { target: 'logout' } });
    },
    [dispatch],
  );

  return (
    <div className="App">
      <BrowserRouter>
        {window.location.pathname !== '/guide' ? (
          <Header>
            <Link to="/">
              <Logo src={logo} alt="canyoufixme logo" />
            </Link>
            <Nav>
              <TopNavLink to="/">홈으로</TopNavLink>
              <TopNavLink to="/list">문제 리스트</TopNavLink>
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
        ) : (
          ''
        )}
        <ConfirmModal
          isOpen={modalStates.openLogout}
          setter={dispatch}
          target={'logout'}
          message={'로그아웃 하시겠습니까?'}
          callback={logout}
        />
        <MessageModal
          isOpen={modalStates.openMessage}
          setter={dispatch}
          target={'message'}
          message={'비정상적인 접근입니다.\n로그인 상태를 확인해주세요.'}
          close={true}
        />
        <LoginContext.Provider value={login}>
          <SocketContext.Provider value={{ socket }}>
            <Switch>
              <Route path="/" exact component={IntroPage} />
              <Route path="/list" exact component={ListPage} />
              <Route path="/login" exact component={LoginPage} />
              <Route path="/debug/:id" component={DebugPage} />
              <Route path="/result" component={ResultPage} />
              <Route path="/write" exact component={WritePage} />
              <Route path="/editor" exact component={EditorPage} />
              <Route path="/guide" exact component={GuidePage} />
              <Route path="/404" component={NotFoundPage} />
              <Redirect path="*" to="/404" />
            </Switch>
          </SocketContext.Provider>
        </LoginContext.Provider>
      </BrowserRouter>
    </div>
  );
};

Modal.setAppElement('#root');

export default App;
