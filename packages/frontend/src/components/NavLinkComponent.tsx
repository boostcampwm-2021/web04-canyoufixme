import React from 'react';
import { NavLink } from 'react-router-dom';

interface NavLinkProps {
  label: string;
  to: string;
}

const NavLinkComponent: React.FC<NavLinkProps> = (props: NavLinkProps) => {
  return (
    <NavLink
      style={{ fontWeight: 800, color: 'white', textDecoration: 'none' }}
      activeClassName="active-router"
      to={props.to}
    >
      {props.label}
    </NavLink>
  );
};

export default NavLinkComponent;
