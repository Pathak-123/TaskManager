import React, { useState } from "react";
import  "../Style/SidebarStyle.css";
import LogoImage from '../assets/logo.svg';
import AnalyticImage from '../assets/analytic.svg';
import BoardImage from '../assets/board.svg';
import SettingImage from '../assets/setting.svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import LogoutModel from "./LogoutModel";

function Sidebar({selectedPage, setSelectedPage}) {
const [openLogoutPopup, setOpenLogoutPopup] = useState(false);

  return (
    <>
    <div className='sidebar-container'>
    <div className='heading'>
      <div className='heading-container'>
        <img src={LogoImage} alt="Logo" />
        <h2>Pro Manage</h2>
      </div>
        <div
          className={`sidebar-item ${selectedPage==='dashboard'?'active':''}`}
          onClick={()=>setSelectedPage('dashboard')}
        >
          <img src={BoardImage} alt="Board" />
          <p >Board</p>
        </div>

        <div
          className={`sidebar-item ${selectedPage==='analytic'?'active':''}`}
          onClick={()=>setSelectedPage('analytic')}
        >
          <img src={AnalyticImage} alt="Analytic" />
          <p>Analytics</p>
        </div>

        <div
          className={`sidebar-item ${selectedPage==='setting'?'active':''}`}
          onClick={()=>setSelectedPage('setting')}
        >
          <img src={SettingImage} alt="Setting" />
          <p >Settings</p>
        </div>
    </div>

    <div
      className='logout'
      onClick={() => setOpenLogoutPopup(true)}
    >   
    <FontAwesomeIcon icon={faSignOutAlt} className="logout-icon" />
       <button className="logout-btn">Logout</button>
    </div>
  </div>
  {openLogoutPopup&&(
  <LogoutModel
      openLogoutPopup={openLogoutPopup}
      setOpenLogoutPopup={setOpenLogoutPopup}
      title='Logout'
      id= {null}
    />
  )}
  </>
  )
}

export default Sidebar
