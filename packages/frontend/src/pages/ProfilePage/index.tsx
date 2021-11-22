import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import styled from '@cyfm/styled';

interface IPublicUser {
  id: string;
  name: string;
}

const FlexWrapper = styled.div`
  display: flex;
`;

const MainWrapper = styled(FlexWrapper)`
  justify-content: center;
  padding: 2em;
`;

const ProfileWrapper = styled(FlexWrapper)``;

const ProfileDetailWrapper = styled(FlexWrapper)`
  margin-right: 3em;
  margin: 0 2em;
  flex-direction: column;
`;

const ProfileName = styled.h3`
  margin: 0;
  font-size: 2.5em;
  color: white;
`;

const ProfileImage = styled.img<{ size: number }>`
  border-radius: 50%;
  max-width: ${props => props.size}px;
  height: ${props => props.size}px;
`;

const ProfileRank = styled.div`
  font-size: 2em;
  color: #ddd;
`;

const ProfilePage = () => {
  const [user, setUser] = useState<IPublicUser>();
  const { name } = useParams<{ name: string }>();

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/user/${name}`)
      .then(res => res.json())
      .then(setUser);
  }, [name]);

  return (
    <MainWrapper>
      <ProfileWrapper>
        <ProfileImage
          size={200}
          src={`https://github.com/${user?.name}.png`}
          alt={user?.name}
        />
        <ProfileDetailWrapper>
          <ProfileName>{user?.name}</ProfileName>
          <ProfileRank>#1</ProfileRank>
        </ProfileDetailWrapper>
      </ProfileWrapper>
    </MainWrapper>
  );
};

export default ProfilePage;
