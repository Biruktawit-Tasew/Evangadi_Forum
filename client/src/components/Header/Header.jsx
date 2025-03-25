// Header.jsx
import React, { useContext, useState } from "react";
import EvangadiLogo from "../../assets/evangadiBlackLogo.png";
import styles from "./header.module.css";
import { Link } from "react-router-dom";
import { AppState } from "../../App";
import { RiMenu3Line } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
const Header = () => {
  const { user, setUser } = useContext(AppState);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  const navigate = useNavigate();
  function handleSignOut() {
    setUser({});
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  }
  return (
    <div className={styles.header}>
      <div className={styles.header_container}>
        <div className={styles.header_logo}>
          <Link to={user.username ? "/home" : "/"}>
            <img src={EvangadiLogo} alt="Evangadi Logo" />
          </Link>
        </div>
        <div
          className={styles.hamburger}
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <RiMenu3Line />
        </div>
        <div
          className={`${styles.header_right} ${
            isMenuOpen ? styles.active : ""
          }`}
        >
          <nav>
            <ul>
              <li className={styles.home}>
                <Link
                  to={user.username ? "/home" : "/"}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </Link>
              </li>
              <li className={styles.work}>
                <Link to="/howItWorks" onClick={() => setIsMenuOpen(false)}>
                  How it Works
                </Link>
              </li>
              {user.username ? (
                <Link to="/" className={styles.button} onClick={handleSignOut}>
                  SIGN OUT
                </Link>
              ) : (
                <Link
                  to="https://www.evangadi.com/"
                  className={styles.join}
                  target="_blank"
                >
                  JOIN THE COMMUNITY
                </Link>
              )}
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Header;
