import React from 'react'
import '../Style/PageNotFoundStyle.css';
import { useNavigate } from 'react-router-dom';

function PageNotFound() {
  const navigate = useNavigate();
  const handleGoBack = () => {
    navigate('/dashboard'); 
  };
  return (
    <div className='pnf-container'>
    <h2>Oops</h2>
    <h1 >404</h1>
    <p>Page Not Found!</p>
    <button className='btn' onClick={handleGoBack}>Go Back To Home Page</button>
  </div>
  )
}

export default PageNotFound
