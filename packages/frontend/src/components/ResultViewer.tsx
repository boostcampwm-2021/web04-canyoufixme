import styled from '@cyfm/styled';

enum ResultCode {
  'success',
  'fail',
  'timeout',
  'pending',
}

interface TestCase {
  id: string;
  result: ResultCode;
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

const TestCaseResult = styled.div``;

const TestCaseResultIndicator = styled.div<{
  size: number;
  result: ResultCode;
}>`
  display: inline-block;
  margin-right: 20px;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  background-color: ${props => {
    switch (props.result) {
      case ResultCode.success:
        return 'green';
      case ResultCode.fail:
      case ResultCode.timeout:
        return 'red';
      case ResultCode.pending:
        return 'orange';
    }
  }};
`;

const RESULT_MESSAGE = {
  [ResultCode.success]: '정답입니다!',
  [ResultCode.fail]: '틀렸습니다!',
  [ResultCode.timeout]: '시간초과!',
  [ResultCode.pending]: '채점중...',
};

const ResultViewer = (props: ResultProps) => {
  const { TestCases } = props;
  return (
    <ResultViewerWrapper>
      {TestCases.map((value, index) => (
        <ResultWrapper key={value.id}>
          <TestCaseResult>
            <TestCaseResultIndicator size={24} result={value.result} />
            {index + 1}번째 결과 : {RESULT_MESSAGE[value.result]}
          </TestCaseResult>
        </ResultWrapper>
      ))}
    </ResultViewerWrapper>
  );
};

export default ResultViewer;
