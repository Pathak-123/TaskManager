import React from "react";
import "../Style/LogoutModelStyle.css";
import { useNavigate } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';
import { deleteTask } from "../services/taskServices";

function LogoutModel({ openLogoutPopup, setOpenLogoutPopup, title, id }) {
  const navigate = useNavigate();
  const handleLogout = async () => {
    if(title==='Delete')
      {
       const response =  await deleteTask(id);
       if(response.success){
        toast.success('Task Deleted Successfully !', { autoClose: 1000 });
        setOpenLogoutPopup(!openLogoutPopup);
        setTimeout(() => {
          window.location.reload();
        }, 1000);

       }
        
      }
      else{
    setOpenLogoutPopup(false);
    localStorage.removeItem("token");
    toast.success("User Logged Out Successfully", { autoClose: 1000 });
    setTimeout(() => {
      navigate("/");
    }, 1000);
  }
    
  };
  return (
    <div className="logout-container-overlay">
      <div className="logout-container">
        <p>{`Are you sure you want to ${title}?`}</p>
        <div className="logout-popup-buttons">
          <button onClick={handleLogout} className="popup-logout-btn">
            {`Yes, ${title}`}
          </button>
          <button
            onClick={() => setOpenLogoutPopup(false)}
            className="logout-cancel"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default LogoutModel;
