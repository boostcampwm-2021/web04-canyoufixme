import React from 'react';

import styled from '@cyfm/styled';

const ButtonComponent = (props: { [name: string]: string }) => {
  return;
  styled.button`
    ${props.style}
  `;
};

export default ButtonComponent;
