import styled from '@cyfm/styled';

enum resultCase {
  'success',
  'fail',
  'timeout',
  'processing',
}

type result = keyof typeof resultCase;

interface TestCase {
  id: string;
  result: result;
}

interface ResultProps {
  TestCases: TestCase[];
}

const ResultViewerWrapper = styled.div`
  display: flex;
  margin: 3rem auto;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 15px;
  width: 80vw;
  height: 100%;
  background-color: #f6cb01;
  box-shadow: 0 0 0 6px black, 0 0 0 12px #f6cb01;
  box-sizing: border-box;
  font-size: 1.5em;
`;

const ResultWrapper = styled.div`
  margin: 15px 0;
`;
const TestCaseResult = styled.div`
  width: 100px;
  height: 100px;
`;

const RESULT_COLOR = {
  success: 'green',
  fail: 'red',
  timeout: 'red',
  processing: 'orange',
};

const RESULT_MESSAGE = {
  success: '정답입니다!',
  fail: '틀렸습니다!',
  timeout: '시간초과!',
  processing: '채점중...',
};

const ResultViewer = (props: ResultProps) => {
  const { TestCases } = props;
  return (
    <ResultViewerWrapper>
      {TestCases.map((value, index) => (
        <ResultWrapper key={value.id}>
          {index}번째 결과 : {RESULT_MESSAGE[value.result]}
          <TestCaseResult
            style={{
              backgroundColor: RESULT_COLOR[value.result],
            }}
          />
        </ResultWrapper>
      ))}
    </ResultViewerWrapper>
  );
};

export default ResultViewer;
