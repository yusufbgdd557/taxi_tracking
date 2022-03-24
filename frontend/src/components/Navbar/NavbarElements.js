import { FaBars, FaSignOutAlt } from 'react-icons/fa';
import { NavLink as Link } from 'react-router-dom';
import styled from 'styled-components';
  
export const Nav = styled.nav`
  background: #e1edfc;
  height: 85px;
  display: flex;
  justify-content: space-between;
  padding: 0;
  margin: -0.4% -0.4% 0.5% -0.4%;
  z-index: 12;
  /* Third Nav */
  /* justify-content: flex-start; */
`;
  
export const NavLink = styled(Link)`
  color: #000000;
  display: flex;
  align-items: center;
  text-decoration: none;
  font-weight: 600;
  font-size: 24px;
  margin: 0 -1.5rem 0 2rem;
  padding: 0 1rem;
  border-radius: 25px;
  height: 50%;
  cursor: pointer;
  &.active {
    background: #fff;
  }
  &:hover {
    background: #fff;
  }
`;

export const NavLogo = styled(Link)`
  display: flex;
  align-items: left;
  padding: 0;
  height: 100%;
  cursor: pointer;
`;
  
export const Bars = styled(FaBars)`
  display: none;
  color: #4f7942;
  @media screen and (max-width: 768px) {
    display: block;
    position: absolute;
    top: 0;
    right: 0;
    transform: translate(-100%, 75%);
    font-size: 1.8rem;
    cursor: pointer;
  }
`;
  
export const NavMenu = styled.div`
  display: flex;
  align-items: center;
  margin-right: -24px;
  /* Second Nav */
  /* margin-right: 24px; */
  /* Third Nav */
  /* width: 100vw;
  white-space: nowrap; */
  @media screen and (max-width: 768px) {
    display: none;
  }
`;
  
export const NavBtn = styled.nav`
  display: flex;
  align-items: center;
  margin-right: 24px;
  /* Third Nav */
  /* justify-content: flex-end;
  width: 100vw; */
  @media screen and (max-width: 768px) {
    display: none;
  }
`;
  
export const NavBtnLink = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 20px;
  font-weight: 600;
  padding: 5px 3px 5px 18px;
  border-radius: 25px;
  height: 50%;
  &:hover {
    background: #fff;
  }
`;

export const NavBtnLogout = styled(FaSignOutAlt)`
  margin: 0 1rem;
`;