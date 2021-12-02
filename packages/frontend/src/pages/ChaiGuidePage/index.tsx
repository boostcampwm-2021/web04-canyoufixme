import React from 'react';
import { nanoid } from 'nanoid';

import styled from '@cyfm/styled';

import GUIDELINES from './GuidelineCase';

import logo from 'assets/images/chai.png';
import { CHAI_API_LINK } from './constant';
import { LINK_MESSAGE } from './message';

const GuideWrapper = styled.div`
  display: flex;
  margin: 3rem auto;
  padding: 1rem;
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

const LinkWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const TextWrapper = styled.div`
  font-size: 1.5rem;
  margin: 10px 0;
`;

const ImageWrapper = styled.div`
  display: flex;
`;

const GuidePage = () => {
  const linkToChai = () => {
    window.open(CHAI_API_LINK);
  };

  return (
    <GuideWrapper>
      <TitleWrapper>Chai 가이드라인</TitleWrapper>
      <ContentWrapper>
        {GUIDELINES.map(guideline => (
          <TestCaseWrapper key={nanoid()}>
            <TestCaseTitle>{guideline.title}</TestCaseTitle>
            {guideline.content.split('\n').map(content => (
              <TestCaseContent>{content}</TestCaseContent>
            ))}
            {guideline.type === 'testcase' ? (
              guideline.codes.map(code => <TestCaseCode>{code}</TestCaseCode>)
            ) : (
              <TestCaseCode>{guideline.codes.join('\n')}</TestCaseCode>
            )}
          </TestCaseWrapper>
        ))}
      </ContentWrapper>
      <LinkWrapper>
        <TextWrapper>{LINK_MESSAGE}</TextWrapper>
        <ImageWrapper>
          <img
            src={logo}
            alt="chai"
            style={{ width: '5em', height: '5em', cursor: 'pointer' }}
            onClick={linkToChai}
          />
        </ImageWrapper>
      </LinkWrapper>
    </GuideWrapper>
  );
};

export default GuidePage;
