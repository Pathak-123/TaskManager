import React, { useState } from "react";
import "../Style/LoginFormStyle.css";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faLock,
  faEye,
  faEyeSlash,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { registerUser } from "../services/userServices";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import Loader from "./Loader";
function RegisterForm({ setShowRegisterForm, showRegisterForm }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [signUpFormData, setSignUpFormData] = useState({
    email: "",
    password: "",
    name: "",
    confirmPassword: "",
  });
  const navigate = useNavigate();
  const [error, setError] = useState({
    nameErr: "",
    emailErr: "",
    passwordErr: "",
    confirmPasswordErr: "",
  });
  const handleFieldFocus = (field) => {
    setError((prevErrors) => ({ ...prevErrors, [`${field}Err`]: "" }));
  };
  const handleToggle = () => {
    setShowRegisterForm(!showRegisterForm);
    setSignUpFormData({
      email: "",
      password: "",
      name: "",
      confirmPassword: "",
    });

    setError({});
  };
  const [loading, setLoading] = useState(false);
  const handleSignupFormChange = (e) => {
    const { name, value } = e.target;
    setSignUpFormData({ ...signUpFormData, [name]: value });
  };
  const validateSignUpForm = () => {
    const newErrors = {};
    if (!signUpFormData.name) {
      newErrors.nameErr = "Username is required";
    }
    if (!signUpFormData.email) {
      newErrors.emailErr = "Email is required";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(signUpFormData.email)) {
        newErrors.emailErr = "Please enter a valid email";
      }
    }
    if (!signUpFormData.password) {
      newErrors.passwordErr = "Password is required";
    }
    if (signUpFormData.password !== signUpFormData.confirmPassword) {
      newErrors.confirmPasswordErr = "Password do not match";
    }
    return newErrors;
  };
  const handleRegisterForm = async (e) => {
    e.preventDefault();
    const validationErrors = validateSignUpForm();
    if (Object.keys(validationErrors).length > 0) {
      setError(validationErrors);
      return;
    }
    setError({});
    setLoading(true);
    toast.dismiss();
    try {
      const response = await registerUser(signUpFormData);
      if (response.success == true) {
        localStorage.setItem("token", response.token);
        toast.success(response.message, { autoClose: 2000 });
        setSignUpFormData({
          email: "",
          password: "",
          name: "",
          confirmPassword: "",
        });
        navigate("/dashboard");
      } else {
        toast.error(response.message);
      }
    } catch (err) {
      toast.error("Server Error. Please Try Again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-main-containers">
      <form className="form" onSubmit={handleRegisterForm}>
        <h2>Register</h2>
        <div className="input-main-container">
          <div className="input-container">
            <FontAwesomeIcon icon={faUser} />
            <input
              type="text"
              placeholder="Username"
              name="name"
              value={signUpFormData.name}
              onChange={handleSignupFormChange}
              onFocus={() => handleFieldFocus("name")}
              disabled={loading}
            />
          </div>
          <p className='input-error'>{error.nameErr}</p>
        </div>
        <div className="input-main-container">
          <div className="input-container">
            <FontAwesomeIcon icon={faEnvelope} />
            <input
              type="text"
              placeholder="Email"
              name="email"
              value={signUpFormData.email}
              onChange={handleSignupFormChange}
              onFocus={() => handleFieldFocus("email")}
              disabled={loading}
            />
          </div>
          <p className='input-error'>{error.emailErr}</p>
        </div>

        <div className="input-main-container">
          <div className="input-container">
            <FontAwesomeIcon icon={faLock} />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              name="password"
              value={signUpFormData.password}
              onChange={handleSignupFormChange}
              onFocus={() => handleFieldFocus("password")}
              disabled={loading}
            />
            <FontAwesomeIcon
              icon={showPassword ? faEyeSlash : faEye}
              onClick={() => setShowPassword(!showPassword)}
            />
          </div>
          <p className='input-error'>{error.passwordErr}</p>
        </div>
        <div className="input-main-container">
          <div className="input-container">
            <FontAwesomeIcon icon={faLock} />
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              name="confirmPassword"
              value={signUpFormData.confirmPassword}
              onChange={handleSignupFormChange}
              onFocus={() => handleFieldFocus("confirmPassword")}
              disabled={loading}
            />
            <FontAwesomeIcon
              icon={showConfirmPassword ? faEyeSlash : faEye}
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            />
          </div>
          <p className='input-error'>{error.confirmPasswordErr}</p>
        </div>

        <button
          style={{
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.6 : 1,
          }}
          disabled={loading}
          className="btn"
          type="submit"
        >
          Register{" "}
        </button>

        <p>Have an account?</p>

        <button
          disabled={loading}
          className="without-fill-btn"
          type="button"
          onClick={() => {
            handleToggle();
            setShowRegisterForm(false);
          }}
        >
          Login
        </button>
        {loading && (
          <div>
            <Loader />
          </div>
        )}
      </form>
    </div>
  );
}

export default RegisterForm;
