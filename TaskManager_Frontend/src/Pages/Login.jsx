import React, { useState } from 'react'
import '../Style/login.css';
import Image from '../assets/LoginArtImage.svg';
import LoginForm from '../Component/LoginForm';
import RegisterForm from '../Component/RegisterForm';

function Login() {
  const[showRegisterForm,setShowRegisterForm]=useState(true);
  return (
    <div className='main-container'>
      <div className='container-left'>
        <img src={Image} alt="" className='left-art-image' />
        <h2>Welcome aboard my friend</h2>
        <p>Just a couple of clicks and we start</p>
      </div>

      <div className='container-right'>
        {showRegisterForm &&(
        <RegisterForm setShowRegisterForm={setShowRegisterForm} showRegisterForm={showRegisterForm}/>
        )
}
{!showRegisterForm &&(
        <LoginForm setShowRegisterForm={setShowRegisterForm} showRegisterForm={showRegisterForm}/>
        )
}
      </div>
    </div>
  )
}

export default Login
