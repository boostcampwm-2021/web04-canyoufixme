import React, {
  useState,
  useReducer,
  useEffect,
  useRef,
  MutableRefObject,
} from 'react';
import { Link } from 'react-router-dom';
import styled from '@cyfm/styled';

import { paginationReducer } from './reducer';
import LoadingModal from 'components/Modal/LoadingModal';

import type { IProblem } from '@cyfm/types';

const Background = styled.div`
  width: 100%;
`;

const ListWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  height: 100%;
`;

const SignLink = styled(Link)`
  text-decoration: none;
  color: black;
  font-weight: 900;
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

let result: IProblem[] | null;
let timeout: number;

const ListPage: React.FC = () => {
  const problemsCnt = 10;
  const [isLoading, setLoading] = useState(false);
  const [paginationState, dispatch] = useReducer(paginationReducer, {
    items: [],
    offset: 0,
  });

  const itemsList: MutableRefObject<HTMLDivElement | null | undefined> =
    useRef();

  useEffect(() => {
    if (!isLoading) {
      timeout = window.setTimeout(() => {
        if (!result) {
          setLoading(true);
        }
        return () => setLoading(false);
      }, 1000);
      fetch(
        `${process.env.REACT_APP_API_URL}/api/problems?limit=${problemsCnt}&offset=${paginationState.offset}`,
      )
        .then(res => res.json())
        .then(json => {
          if (json && json.length > 0) {
            result = json;
            dispatch({
              type: 'addItems',
              items: json,
              offset: problemsCnt,
            });
          }
        })
        .finally(() => {
          result = null;
          window.clearTimeout(timeout);
        });
    }
    return () => {};
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [paginationState.offset]);

  const ioRef: MutableRefObject<IntersectionObserver | undefined> = useRef();
  useEffect(() => {
    const ioOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 1.0,
    };
    ioRef.current = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          dispatch({ type: 'incOffset', offset: problemsCnt });
          observer.unobserve(entry.target);
        }
      });
    }, ioOptions);
  }, []);

  useEffect(() => {
    const itemsElement = itemsList.current as HTMLDivElement;
    const lastChild = itemsElement?.lastChild as Element;
    return () => {
      if (lastChild) ioRef.current?.observe(lastChild);
      else ioRef.current?.observe(itemsElement);
    };
  }, [paginationState.items]);

  return (
    <Background>
      <ListWrapper ref={itemsList}>
        {paginationState.items.map(item => (
          <SignLink to={`/debug/${item.codeId}`} key={item.codeId}>
            <Sign>{item.title}</Sign>
          </SignLink>
        ))}
      </ListWrapper>
      <LoadingModal isOpen={isLoading} />
    </Background>
  );
};

export default ListPage;
