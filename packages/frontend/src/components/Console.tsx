import React, { useEffect, useRef } from 'react';
import styled from '@cyfm/styled';

type PartialTextAreaAttributes = Partial<HTMLTextAreaElement>;
const BaseConsole = styled.textarea<PartialTextAreaAttributes>`
  font-family: 'Nanum Gothic Coding', monospace;
  color: white;
  width: 100%;
  height: 100%;
  padding: 15px;
  background-color: transparent;
  border: 0;
  resize: none;
`;

const Console: React.FC<PartialTextAreaAttributes> = ({ value }) => {
  const textareaRef = useRef<HTMLTextAreaElement>();
  useEffect(() => {
    if (!textareaRef.current) return;
    textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
  }, [value]);
  return <BaseConsole ref={textareaRef} value={value} />;
};

export default Console;
