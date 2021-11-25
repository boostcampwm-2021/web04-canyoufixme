import { NavLink } from 'react-router-dom';
import styled from '@cyfm/styled';

interface NavLinkProps {
  children: string;
  to: string;
}

const TopNavLink = styled<NavLinkProps>(NavLink)`
  font-weight: 800;
  color: white;
  text-decoration: none;
`;
export default TopNavLink;
