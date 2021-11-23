import React, { useState, useEffect, useCallback, useContext } from 'react';
import { Redirect, useHistory } from 'react-router';
import { nanoid } from 'nanoid';

import SocketContext from 'contexts/SocketContext';
import ResultViewer from 'components/ResultViewer';

import styled from '@cyfm/styled';

enum resultCase {
  'success',
  'fail',
  'processing',
}

type result = keyof typeof resultCase;

interface TestCase {
  id: string;
  result: result;
}

interface State {
  code?: string;
  testCode?: TestCase[];
  problemId?: string;
}

const ResultPage = () => {
  const history = useHistory();
  const state = history.location.state as State | undefined;
  const { code, testCode, problemId } = state
    ? state
    : { code: null, testCode: null, problemId: null };

  const [idList, setIdList] = useState<string[]>(
    Array(testCode?.length)
      .fill(0)
      .map(val => nanoid()),
  );
  const [result, setResult] = useState<TestCase[]>(
    idList.map(value => {
      return { id: value, result: 'processing' };
    }),
  );
  const socket = useContext(SocketContext).socket;

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
    socket.on('result', data => {
      const message = data.result;
      if (message === 'success') {
        updateResultViewer({ id: data.id, result: 'success' });
      } else if (message.startsWith('Promise timed out')) {
        updateResultViewer({ id: data.id, result: 'timeout' });
      } else {
        updateResultViewer({ id: data.id, result: 'fail' });
      }
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
