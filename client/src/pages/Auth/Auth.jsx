import React, { useState } from "react";
import styles from "./auth.module.css";
import LogIn from "../../components/Login/Login";
import SignUp from "../../components/SignUp/SignUp";
import About from "../../components/About/About";

const Auth = () => {
  const [isLogIn, setIsLogIn] = useState(true);
  const [direction, setDirection] = useState("");

  const toggleAuthMode = () => {
    setDirection("toLeft"); // Always slide to left
    setTimeout(() => {
      setIsLogIn((prev) => !prev);
      setDirection("");
    }, 300); // Matches CSS transition duration
  };

  return (
    <div className={styles["container-wrapper"]}>
      <div className={styles["inner-wrapper"]}>
        <div className={styles["SignUpSignIn-section"]}>
          <div className={styles["auth-card"]}>
            <div className={styles["auth-content-container"]}>
              <div
                className={`${styles["auth-content"]} ${
                  direction === "toLeft"
                    ? styles["slide-to-left"]
                    : styles["slide-in"]
                }`}
              >
                {isLogIn ? (
                  <LogIn toggleAuth={toggleAuthMode} />
                ) : (
                  <SignUp toggleAuth={toggleAuthMode} />
                )}
              </div>
            </div>
          </div>
        </div>
        <div className={styles["about-section"]}>
          <About />
        </div>
      </div>
    </div>
  );
};

export default Auth;
