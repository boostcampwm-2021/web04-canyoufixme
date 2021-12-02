import React, {
  useState,
  useEffect,
  useCallback,
  useContext,
  useReducer,
} from 'react';
import { Redirect, useHistory } from 'react-router';
import { nanoid } from 'nanoid';
import styled from '@cyfm/styled';
import { ResultCode } from '@cyfm/types';
import type { ITestCase } from '@cyfm/types';

import Button from 'components/Button';
import { LoginContext } from 'contexts/LoginContext';
import SocketContext from 'contexts/SocketContext';
import { modalReducer } from 'pages/ResultPage/reducer';
import ResultViewer from 'components/ResultViewer';
import MessageModal from 'components/Modal/MessageModal';
import { TEST_FAIL_MESSAGE } from './message';

const PageWrapper = styled.div`
  display: flex;
  justify-content: center;
`;

const ResultWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: end;
  width: 80%;
`;

const ButtonWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
`;

const CustomButton = styled(Button)`
  margin: 0 1em;
  font-weight: bold;
  box-shadow: 0 0 0 3px black;
  border-radius: 15px;
`;

interface State {
  code?: string;
  testCode?: ITestCase[];
  problemId?: string;
}

const ResultPage = () => {
  const { isLogin } = useContext(LoginContext);
  const [modalState, dispatch] = useReducer(modalReducer, {
    message: TEST_FAIL_MESSAGE,
    openMessage: false,
  });
  const history = useHistory();
  const state = history.location.state as State | undefined;
  const { code, testCode, problemId } = state
    ? state
    : { code: null, testCode: null, problemId: null };

  const [idList] = useState<string[]>(
    Array(testCode?.length)
      .fill(0)
      .map(val => nanoid()),
  );
  const [result, setResult] = useState(
    idList.map(value => {
      return { id: value, result: ResultCode.pending };
    }),
  );
  const { socket } = useContext(SocketContext);

  const updateResultViewer = useCallback(data => {
    const { id, result } = data;
    setResult(prevState => {
      const copiedState = [...prevState];
      const caseIdx = copiedState.findIndex(value => value.id === id);
      copiedState[caseIdx] = { ...copiedState[caseIdx], result: result };
      return copiedState;
    });
  }, []);

  useEffect(() => {
    socket.on('testSuccess', ({ id, resultCode }) => {
      updateResultViewer({ id, result: resultCode });
    });

    socket.on('testFail', ({ id, resultCode, message }) => {
      updateResultViewer({ id, result: resultCode });
    });

    socket.on('error', error => {
      dispatch({ type: 'open', payload: { target: 'message' } });
    });

    if (state) {
      const payload = {
        code,
        problemId,
        id: idList,
      };

      socket.emit('submit', payload);
    }
  }, [code, idList, problemId, socket, state, testCode, updateResultViewer]);

  return (
    <>
      {isLogin ? (
        code && testCode ? (
          <>
            <PageWrapper>
              <ResultWrapper>
                <ResultViewer TestCases={result}></ResultViewer>
                <ButtonWrapper>
                  {result.some(testcase => testcase.result === 3) ||
                  result.every(testcase => testcase.result === 0) ? (
                    ''
                  ) : (
                    <CustomButton
                      onClick={() => {
                        history.push(`/debug/${problemId}`);
                      }}
                    >
                      다시 풀어보기
                    </CustomButton>
                  )}
                  <CustomButton
                    onClick={() => {
                      history.push('/list');
                    }}
                  >
                    다른 문제 풀러가기
                  </CustomButton>
                </ButtonWrapper>
                <MessageModal
                  isOpen={modalState.openMessage}
                  setter={dispatch}
                  message={modalState.message}
                  target={'message'}
                />
              </ResultWrapper>
            </PageWrapper>
          </>
        ) : (
          <Redirect to="/" />
        )
      ) : (
        <Redirect to="/login" />
      )}
    </>
  );
};

export default ResultPage;
