import React, { useEffect, useState } from 'react'
import Sidebar from '../Component/Sidebar'
import Dashboard from './Dashboard'
import Analytic from './Analytic';
import Setting from './Setting';
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";

function Home() {
  const [selectedPage, setSelectedPage] = useState('dashboard');
const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    const path = location.pathname.slice(1);
    setSelectedPage(path || 'dashboard');
  }, [location.pathname]);
const handlePageChange = (page) => {
    setSelectedPage(page);
    navigate(`/${page}`);
  };


  
  return (
    <div className='home-main-container'>
     <Sidebar selectedPage={selectedPage} setSelectedPage={handlePageChange}/>
      <Routes>

          <Route path="/dashboard"  element={<Dashboard />} />
          <Route path="/analytic" element={<Analytic />} />
          <Route path="/setting" element={<Setting />} />       
        </Routes>
    </div>
  )
}

export default Home