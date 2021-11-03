import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from '@cyfm/styled';

const Background = styled.div`
  width: 100%;
`;

const ListWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  height: 100%;
`;

const Sign = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 300px;
  height: 150px;
  border-radius: 15px;
  background-color: #f6cb01;
  box-shadow: 0 0 0 6px black, 0 0 0 12px #f6cb01;
  margin: 24px;
  box-sizing: border-box;
  font-size: 1.5em;
`;

const ListPage: React.FC = () => {
  const [items] = useState(Array(100).fill(null));

  return (
    <Background>
      <ListWrapper>
        {items.map(_ => (
          <Link
            style={{
              textDecoration: 'none',
              color: 'black',
              fontWeight: 900,
            }}
            to="/debug"
          >
            <Sign>array? object?</Sign>
          </Link>
        ))}
      </ListWrapper>
    </Background>
  );
};

export default ListPage;
