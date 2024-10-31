import React, { useState } from "react";
import '../Style/LoginFormStyle.css';
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope ,faLock, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'; 
import { loginUser } from "../services/userServices";
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';
import Loader from "./Loader";


function LoginForm({setShowRegisterForm,showRegisterForm}) {
    const [showPassword, setShowPassword] = useState(false);
    const [loginFormData, setLoginFormData] = useState({
      email: '',
      password: '',
  
    });
    const [error, setError] = useState({
      emailErr: "",
      passwordErr: "",
    });
    const handleFieldFocus = (field) => {
      setError((prevErrors) => ({ ...prevErrors, [`${field}Err`]: "" }));
    };
    const handleLoginFormChange = (e) => {
      const { name, value } = e.target;
      setLoginFormData({ ...loginFormData, [name]: value });
    };
    const handleToggle = () => {
      setShowRegisterForm(!showRegisterForm)
      setLoginFormData({ email: '', password: '' });      
      setError({});
    }
    const [loading, setLoading] = useState(false);
  
     const navigate = useNavigate();
     const validateLoginForm = () => {
      const newErrors = {};
      if (!loginFormData.email) {
        newErrors.emailErr = 'Email is required';
      }  else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(loginFormData.email)) {
          newErrors.emailErr = "Please enter a valid email";
        }
      }
      if (!loginFormData.password) {
        newErrors.passwordErr = 'Password is required';
      }
      return newErrors;
    };
  
    const handleLoginForm = async (e) => {    
      e.preventDefault();
      const validationErrors = validateLoginForm();
      if (Object.keys(validationErrors).length > 0) {
        setError(validationErrors);
        return;
      }
      setError({});
      setLoading(true);
      try{
        const response = await loginUser(loginFormData);
        if(response.success == true){
          toast.success(response.message,{ autoClose: 2000 });
          localStorage.setItem('token', response.token);
          navigate('/dashboard');

        }
        else{
          toast.error(response.message);
        }
      }catch(err)
      {
        toast.error("Server Error. Please Try Again");
      }  finally {
        setLoading(false); 
      }
    };
  
  return (
    <div className='form-main-containers'>
      <form className='form' onSubmit={handleLoginForm}>
        <h2>Login</h2>

        <div className='input-main-container'>
          <div className='input-container'>
          <FontAwesomeIcon icon={faEnvelope} />
            <input
              type="text"
              placeholder="Email"
              name="email"
              value={loginFormData.email}
              onChange={handleLoginFormChange}
              onFocus={() => handleFieldFocus("email")}
              disabled={loading}
            />
          </div>
          <p className='input-error'>{error.emailErr}</p>
        </div>

        <div className='input-main-container'>
          <div className='input-container'>
          <FontAwesomeIcon icon={faLock} />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              name="password"
              value={loginFormData.password}
              onChange={handleLoginFormChange}
              onFocus={() => handleFieldFocus("password")}
              disabled={loading}
            />
            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} onClick={()=>setShowPassword(!showPassword)} />
          </div>
          <p className='input-error'>{error.passwordErr}</p>
        </div>
        <button style={{
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.6 : 1,
          }} disabled={loading} className='btn' type="submit">
           Log in
        </button>

        <p>Have no account yet?</p>

        <button
        disabled={loading}
          className='without-fill-btn'
          type="button"  
          onClick={()=>{handleToggle();
            setShowRegisterForm(true)}}
        >
          Register
        </button>
        {loading && (
          <div>
            <Loader />
          </div>
        )}
      </form>
    </div>
  )
}

export default LoginForm;
