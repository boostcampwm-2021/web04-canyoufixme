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

interface Item {
  id: number;
  title: string;
  author: string;
  category: string;
  level: number;
}

const ListPage: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/list`)
      .then(res => res.json())
      .then(json => setItems(json.items));
  }, []);

  return (
    <Background>
      <ListWrapper>
        {items.map((item: Item) => (
          <Link
            style={{
              textDecoration: 'none',
              color: 'black',
              fontWeight: 900,
            }}
            to={`/debug/${item.id}`}
            key={item.id}
          >
            <Sign>{item.title}</Sign>
          </Link>
        ))}
      </ListWrapper>
    </Background>
  );
};

export default ListPage;
