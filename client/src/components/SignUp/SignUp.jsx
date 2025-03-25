import React, { useState, useRef, useEffect ,useContext} from "react";
import axios from "../../Api/axios";
import { useNavigate, Link } from "react-router-dom";
import css from "./signUp.module.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { ClipLoader } from "react-spinners";
import { AppState } from "../../App";


const SignUp = ({ toggleAuth }) => {
  const { user, setUser } = useContext(AppState);
  const [formData, setFormData] = useState({
    username: "",
    firstname: "",
    lastname: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();
  const usernameRef = useRef(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    usernameRef.current.focus();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors((prevErrors) => ({ ...prevErrors, [name]: false }));
  };

  const validateForm = () => {
    const newErrors = {};


    if (!formData.username) {
      newErrors.username = true;
      setErrors(newErrors);
      return false;
    }

    if (!formData.firstname) {
      newErrors.firstname = true;
      setErrors(newErrors);
      return false;
    }

    if (!formData.lastname) {
      newErrors.lastname = true;
      setErrors(newErrors);
      return false;
    }

    if (!formData.email) {
      newErrors.email = true;
      setErrors(newErrors);
      return false;
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
      setErrors(newErrors);
      return false;
    }

    if (!formData.password) {
      newErrors.password = true;
      setErrors(newErrors);
      return false;
    }

    if (formData.password && formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
      setErrors(newErrors);
      return false;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;
    setLoading(true);
    try {
      console.log(formData);
      const response = await axios.post("/users/register", formData);
      setSuccessMessage(response.data.msg);
      setErrors({});
      if (response) {
        const { data } = await axios.post("/users/login", {
          email: formData.email,
          password: formData.password,
        });
        localStorage.setItem("token", data.token);
        setUser(data)
        setTimeout(() => {
          navigate("/home");
        }, 2000);
      }
    } catch (err) {
      if (err.response) {
        setErrors({ api: err.response.data.msg });
      } else {
        setErrors({ api: "An error occurred. Please try again." });
      }
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      {successMessage && (
        <p style={{ color: "green" }} className="success-message">
          {successMessage}
        </p>
      )}
      {errors.api && (
        <p style={{ color: "red" }} className="error-message">
          {errors.api}
        </p>
      )}
      <h3>Join the Network</h3>
      <p>
        Already have an account?
        <Link onClick={toggleAuth} className={css.toggleButton}>
          Sign in
        </Link>
      </p>

      <form onSubmit={handleSubmit} className={css.formContainer}>
        <div className={css.formGroup}>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            ref={usernameRef}
            placeholder="Username"
            className={css.username_input}
            style={{
              borderColor: errors.username ? "#E01E5A" : "",
            }}
          />
        </div>
        <div className={css.nameFields}>
          <div className={css.formGroup}>
            <input
              type="text"
              name="firstname"
              value={formData.firstname}
              onChange={handleChange}
              placeholder="First Name"
              style={{
                borderColor: errors.firstname ? "#E01E5A" : "",
              }}
            />
          </div>

          <div className={css.formGroup}>
            <input
              type="text"
              name="lastname"
              value={formData.lastname}
              onChange={handleChange}
              placeholder="Last Name"
              style={{
                borderColor: errors.lastname ? "#E01E5A" : "",
              }}
            />
          </div>
        </div>
        <div className={css.formGroup}>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email address"
            style={{
              borderColor: errors.email ? "#E01E5A" : "",
            }}
          />
        </div>
        {errors.email && <div className={css.errorMessage}>{errors.email}</div>}

        <div className={css.formGroup} style={{ position: "relative" }}>
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            style={{
              borderColor: errors.password ? "#E01E5A" : "",
              paddingRight: "40px",
            }}
          />

          <span
            onClick={togglePasswordVisibility}
            style={{
              position: "absolute",
              right: "0px",
              top: "21%",
              cursor: "pointer",
            }}
          >
            {showPassword ? (
              <FaEye
                size={25}
                style={{
                  color: "#eac0c1",
                  marginRight: "20px",
                  marginTop: "5px",
                }}
              />
            ) : (
              <FaEyeSlash
                size={25}
                style={{
                  color: "#eac0c1",
                  marginRight: "20px",
                  marginTop: "5px",
                }}
              />
            )}
          </span>
        </div>
        {errors.password && (
          <div className={css.errorMessage}>{errors.password}</div>
        )}

        <div className={css.centeredText}>
          <small>
            I agree to the <Link to="#">privacy policy</Link> and{" "}
            <Link to="#">term of service</Link>
          </small>
        </div>
        <button type="submit" className={css.signUp_Button}>
          {loading ? (
            <ClipLoader color="#ffffff" size={27} />
          ) : (
            "Agree and Join"
          )}
        </button>
      </form>
    </>
  );
};

export default SignUp;
