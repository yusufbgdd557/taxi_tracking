import React from 'react';
import {
    Nav,
    NavLink,
    Bars,
    NavMenu,
    NavBtn,
    NavBtnLink,
    NavLogo,
    NavBtnLogout
} from './NavbarElements';
import PropTypes from 'prop-types';
import { toast } from "react-toastify";
import Logo from '../../assets/logo.svg'


const Navbar = (props) => {

    const logMeOut = () => {
        fetch("http://localhost:8000/logout", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ "email": props.email })
        }).then((res) => res.json())
            .then((data) => {
                props.logout()
                props.removeEmail();
                toast.success("logout successfully");
            });
    }

    return (
        <>
            <Nav>
                <Bars />

                <NavMenu>
                    <NavLogo to='/main' activeStyle>
                        <img src={Logo}></img>
                    </NavLogo>
                    <NavLink to='/instant' activeStyle>
                        Instant
                    </NavLink>
                    <NavLink to='/search' activeStyle>
                        Search By Time
                    </NavLink>
                    <NavLink to='/maps' activeStyle>
                        Seach By Taxi
                    </NavLink>
                </NavMenu>
                <NavBtn>
                    <NavBtnLink to='/logout' onClick={() => logMeOut()}>Logout <NavBtnLogout /></NavBtnLink>
                </NavBtn>
            </Nav>
        </>
    );
};

export default Navbar;

Navbar.propTypes = {
    logout: PropTypes.func,
    removeEmail: PropTypes.func,
    email: PropTypes.string
};