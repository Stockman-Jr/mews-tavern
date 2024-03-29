import React from 'react';

import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';

import styles from '../styles/NavBar.module.css';
import appStyles from "../App.module.css";
import btnStyles from '../styles/Buttons.module.css';
import logo from '../assets/logo.png';

import { CgAdd, CgBrowse } from "react-icons/cg";
import { TbPokeball } from "react-icons/tb";
import { BiHomeHeart } from "react-icons/bi";

import { NavLink } from 'react-router-dom';
import { useCurrentUser, useSetCurrentUser } from '../contexts/CurrentUserContext';
import axios from 'axios';
import "../index.css";
import { ProfileMenuDropdown } from './DropdownMenus';
import { removeTokenTimestamp } from '../utils/utils';



const NavBar = () => {
  const currentUser = useCurrentUser();
  const setCurrentUser = useSetCurrentUser();
  const profile_avatar = currentUser?.profile_avatar;

  const handleSignOut = async () => {
    try{
      await axios.post("dj-rest-auth/logout/");
      setCurrentUser(null);
      removeTokenTimestamp();
    }catch(err){
      console.log(err);
    }
  };

  const loggedInAuthLinks = <>
    <NavLink className={btnStyles.AuthBtn} to="/" onClick={handleSignOut}>Log out</NavLink>
  </>;

  const loggedInLinks = <>
          <NavLink to="/posts/create" activeClassName={styles.Active}>
        Add Post{" "}
        <span className={appStyles.Icons}>
          <CgAdd />
        </span>
      </NavLink>
  </>;

  const loggedOutAuthLinks = <>
      <NavLink className={btnStyles.AuthBtn} to="/signup">Sign Up</NavLink>
      <NavLink className={btnStyles.AuthBtn} to="/signin">Log In</NavLink>
  </>;

  const logoLink = (
    <>
      <NavLink to="/">
        <Navbar.Brand>
          <img className={styles.Logo} src={logo} alt="logo" />
        </Navbar.Brand>
      </NavLink>
    </>
  );

  const profileNav = (
    <>
 
        {currentUser && (
          <ProfileMenuDropdown
            profileAvatar={profile_avatar}
            id={currentUser.profile_id}
          />
        )}

     </>

  );


  return (
    <> 
    <Navbar className={`${styles.NavBar}`} expand="md">
    {currentUser ? profileNav : logoLink}
 
  <Navbar.Toggle aria-controls="basic-navbar-nav ml-auto" />
  <Navbar.Collapse id="basic-navbar-nav" className="mt-3">
    <Nav className={`${styles.NavLeft} ml-auto`}>
    <NavLink to="/" activeClassName={styles.Active}>
            Home{" "}
            <span className={appStyles.Icons}>
              <BiHomeHeart />
            </span>
          </NavLink>
          <NavLink to="/posts" activeClassName={styles.Active}>
            Feed{" "}
            <span className={appStyles.Icons}>
              <CgBrowse />
            </span>
          </NavLink>
          <NavLink to="/pokedex/1" activeClassName={styles.Active}>
            PokéDex{" "}
            <span className={appStyles.Icons}>
              <TbPokeball />
            </span>
          </NavLink>
      {currentUser ? loggedInLinks : ''}
    </Nav>
    <Nav className={`${styles.NavLeft} ml-auto`}>
      {currentUser ? loggedInAuthLinks : loggedOutAuthLinks}
    </Nav>
  </Navbar.Collapse>
</Navbar>
</>
  );
}

export default NavBar;