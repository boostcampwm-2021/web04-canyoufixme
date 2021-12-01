import React, { useState, useEffect, useCallback, useContext } from 'react';
import { Redirect, useHistory } from 'react-router';
import { nanoid } from 'nanoid';
import { ResultCode } from '@cyfm/types';
import type { ITestCase } from '@cyfm/types';

import SocketContext from 'contexts/SocketContext';
import ResultViewer from 'components/ResultViewer';

interface State {
  code?: string;
  testCode?: ITestCase[];
  problemId?: string;
}

const ResultPage = () => {
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

    socket.on('error', error => {});

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
      {code && testCode ? (
        <>
          <ResultViewer TestCases={result}></ResultViewer>
        </>
      ) : (
        <Redirect to="/" />
      )}
    </>
  );
};

export default ResultPage;
