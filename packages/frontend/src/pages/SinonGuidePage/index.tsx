import React from 'react';
import { nanoid } from 'nanoid';

import 'ace-builds';
import 'ace-builds/webpack-resolver';
import AceEditor from 'react-ace';

import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/theme-twilight';

import styled from '@cyfm/styled';

import GUIDELINES from './GuidelineCase';

import logo from 'assets/images/sinon.png';
import { EDITOR_HEIGHT, SINON_API_LINK } from './constant';
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
  margin: 3px 0;
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
    window.open(SINON_API_LINK);
  };

  return (
    <GuideWrapper>
      <TitleWrapper>Sinon 가이드라인</TitleWrapper>
      <ContentWrapper>
        {GUIDELINES.map(guideline => (
          <TestCaseWrapper key={nanoid()}>
            <TestCaseTitle>{guideline.title}</TestCaseTitle>
            {guideline.content.split('\n').map(content => (
              <TestCaseContent>{content}</TestCaseContent>
            ))}
            <AceEditor
              mode="javascript"
              width="100%"
              height={EDITOR_HEIGHT}
              theme="twilight"
              name="reader"
              fontSize={16}
              value={guideline.codes}
              defaultValue={guideline.codes}
              readOnly={true}
              editorProps={{ $blockScrolling: true }}
              setOptions={{
                tabSize: 2,
              }}
            />
          </TestCaseWrapper>
        ))}
      </ContentWrapper>
      <LinkWrapper>
        <TextWrapper>{LINK_MESSAGE}</TextWrapper>
        <ImageWrapper>
          <img
            src={logo}
            alt="sinon"
            style={{ width: '5em', height: '5em', cursor: 'pointer' }}
            onClick={linkToChai}
          />
        </ImageWrapper>
      </LinkWrapper>
    </GuideWrapper>
  );
};

export default GuidePage;
