import React from "react";
import styles from "./about.module.css";
import { Link } from "react-router";

const About = () => {
  return (
    <div className={styles["about_section"]}>
      <div className={styles.internal_wrapper}>
        <h3>About </h3>
        <h1>Evangadi Networks</h1>
        <p>
          No matter what stage of life you are in, whether you're just starting
          elementary school or being promoted to CEO of a Fortune 50 company,
          you have much to offer to those who are trying to follow in your
          footsteps.
        </p>
        <p>
          Whether you are willing to share your knowledge or you are just lookin
          to meet mentors of your own, please start by joining the network here.
        </p>
        <div>
          <Link to="/howItWorks">
            <button className={styles.button}>HOW IT WORKS</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default About;
