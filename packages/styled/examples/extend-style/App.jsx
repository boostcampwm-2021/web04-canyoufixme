import React from 'react';
import styled from '@cyfm/styled';

const BlueButton = styled.button`
  border: 0;
  padding: 10px;
  background-color: blue;
`;

const BlueWithWhiteTextButton = styled(BlueButton)`
  color: white;
`;

const RedWithWhiteTextButton = styled(BlueWithWhiteTextButton)`
  background-color: crimson;
`;

export default function App() {
  return (
    <div>
      <BlueWithWhiteTextButton>click me</BlueWithWhiteTextButton>
      <RedWithWhiteTextButton>click me</RedWithWhiteTextButton>
    </div>
  );
}
