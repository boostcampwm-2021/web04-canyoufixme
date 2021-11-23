import { nanoid } from 'nanoid';

import styled from '@cyfm/styled';

import TESTCASES from './GuidelineCase';

const GuideWrapper = styled.div`
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

const TitleWrapper = styled.div`
  margin-bottom: 1rem;
  text-align: center;
  font-size: 3rem;
  font-weight: bold;
`;

const ContentWrapper = styled.div`
  text-align: center;
  height: 80%;
  overflow-y: auto;
`;

const TestCaseWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 1rem 0;
`;

const TestCaseTitle = styled.div`
  font-size: 2rem;
  font-weight: bold;
`;

const TestCaseContent = styled.div`
  font-size: 1.5rem;
  margin: 10px 0;
`;

const TestCaseCode = styled.div`
  display: flex;
  font-size: 1.5rem;
  font-weight: bold;
  color: white;
  background-color: black;
  margin-bottom: 15px;
  padding: 10px;
  width: 80%;
  border-radius: 5px;
`;

const GuidePage = () => {
  return (
    <GuideWrapper>
      <TitleWrapper>테스트케이스 가이드라인</TitleWrapper>
      <ContentWrapper>
        {TESTCASES.map(testcase => (
          <TestCaseWrapper key={nanoid()}>
            <TestCaseTitle>{testcase.title}</TestCaseTitle>
            <TestCaseContent>{testcase.content}</TestCaseContent>
            {testcase.codes.map(code => (
              <TestCaseCode>{code}</TestCaseCode>
            ))}
          </TestCaseWrapper>
        ))}
      </ContentWrapper>
    </GuideWrapper>
  );
};

export default GuidePage;
