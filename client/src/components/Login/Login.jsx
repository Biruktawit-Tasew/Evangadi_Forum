import { useRef, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../../Api/axios";
import styles from "./login.module.css";
import { BiSolidHide, BiShow } from "react-icons/bi";
import { AppState } from "../../App";

function LogIn({ toggleAuth }) {
  const { user, setUser } = useContext(AppState);
  const [isEmptyEmail,setIsEmptyEmail] = useState(false)
  const [isEmptyPass, setIsEmptyPass] = useState(false);
  const navigate = useNavigate();
  const emailDom = useRef();
  const passwordDom = useRef();
  const [passwordVisible, setPasswordVisible] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    const emailValue = emailDom.current.value;
    const passValue = passwordDom.current.value;

    if (!emailValue) {
      setIsEmptyEmail(true);
      return;
    }
    if (!passValue) {
      setIsEmptyPass(true);
      return
    }
    // console.log(emailValue, passValue);
    try {
      const { data } = await axios.post("/users/login", {
        email: emailValue,
        password: passValue,
      });
      // console.log(data.token);
      localStorage.setItem("token", data.token);
      setUser(data);
      navigate("/home");
    } catch (error) {
      alert(error?.response?.data?.msg);
      // console.log(error?.response?.data.msg);
    }
  }

  const togglePasswordVisibility = () => {
    setPasswordVisible((prevState) => !prevState);
  };

  return (
    <section className={styles.main_container}>
      <div className={styles.login__container}>
        <h1>Login to your account</h1>
        <div className={styles.signup}>
          Don’t have an account?{" "}
          <Link onClick={toggleAuth} className={styles.toggleButton}>
            Create a new account
          </Link>
        </div>
        <br />

        <form onSubmit={handleSubmit}>
          <div className={styles.form}>
            <input
              className={`${styles.email} ${
                isEmptyEmail ? styles.borderColor : ""
              }`}
              type="email"
              placeholder="Email address"
              id="email"
              ref={emailDom}
            />
          </div>

          <div className={styles.form}>
            <input
              className={`${styles.parent} ${
                isEmptyPass ? styles.borderColor : ""
              }`}
              type={passwordVisible ? "text" : "password"}
              placeholder="********"
              id="password"
              ref={passwordDom}
            />
            <div onClick={togglePasswordVisibility}>
              {passwordVisible ? (
                <BiShow size={30} className={styles.eye} />
              ) : (
                <BiSolidHide size={30} className={styles.eye} />
              )}
            </div>
          </div>
          <div className={styles.forget}>
            <Link to="/forgot-password">Forgot password?</Link>
          </div>
          <button type="submit" className={styles.login__button}>
            Login
          </button>
        </form>
      </div>
    </section>
  );
}

export default LogIn;
