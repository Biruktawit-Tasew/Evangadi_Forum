import React from "react";
import style from "./footer.module.css";
import logo from "../../assets/evangadiWhiteLogo.png";
import { FaFacebookF } from "react-icons/fa";
import { TiSocialInstagram } from "react-icons/ti";
import { Link } from "react-router-dom";
import { FaYoutube } from "react-icons/fa6";

function Footer() {
  return (
    <section className={style.footer_container}>
      <section className={style.footer_inner_container}>
        {/* left side links wrapper */}
        <div className={style.left_side_links}>
          <div className={style.footer_logo}>
            <Link to="/">
              <img src={logo} alt="" />
            </Link>
          </div>
          <div className={style.footer_icons}>
            <Link to="https://www.facebook.com/evangaditech" target="_blank">
              <FaFacebookF size={38} />
            </Link>
            <Link to="https://www.instagram.com/evangaditech" target="_blank">
              <TiSocialInstagram size={38} />
            </Link>
            <Link to="https://www.youtube.com/@EvangadiTech" target="_blank">
              <FaYoutube size={38} />
            </Link>
          </div>
        </div>
        {/* middle links wrapper */}
        <div className={style.middle_links}>
          <h4>Useful link</h4>
          <p>
            <Link to="/howItWorks">How it Works</Link>
          </p>
          <p>
            <Link to="https://www.evangadi.com/legal/terms/" target="_blank">
              Terms of Service
            </Link>
          </p>
          <p>
            <Link to="https://www.evangadi.com/legal/privacy/" target="_blank">
              Privacy policy
            </Link>
          </p>
        </div>
        {/* right side links wrapper */}
        <div className={style.right_side_links}>
          <h4>Contact Info</h4>
          <p>
            <Link to="/">Evangadi Networks</Link>
          </p>
          <p>support@evangadi.com</p>
          <p>+1-202-386-2702</p>
        </div>
      </section>
    </section>
  );
}

export default Footer;
