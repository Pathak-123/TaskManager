import React, { useEffect, useState } from "react";
import "../Style/SettingStyle.css";
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
import { getWelcomeData } from "../utils/helperFunction";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import { updateUser } from "../services/userServices";

function Setting() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [userDetails, setUserDetails] = useState({
    username: "",
    email: "",
    password: "",
    newPassword: ""
  });
  const [initialValues, setInitialValues] = useState({
    username: "",
    email: ""
  });
  const [isModified, setIsModified] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value
    }));
  };
  const [loading, setLoading] = useState(false);

  const handleUpdateForm = async (e) => {
    setLoading(true);
    e.preventDefault();
    toast.dismiss();
    try {
      const response = await updateUser(userDetails);
      if(response.success){
        
      toast.success(response.message || "Profile updated successfully");
      localStorage.removeItem("token"); 
      navigate("/"); 
      }
      else{
        toast.error(response.message);
      }

    } catch (error) {
      toast.error(error.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const { username, email } = getWelcomeData();
    setUserDetails((prevDetails) => ({
      ...prevDetails,
      username,
      email
    }));
    setInitialValues({ username, email });
  }, []);
  useEffect(() => {
    const isUsernameChanged = userDetails.username !== initialValues.username;
    const isEmailChanged = userDetails.email !== initialValues.email;
    const isPasswordFilled = userDetails.password !== "" || userDetails.newPassword !== "";
    setIsModified(isUsernameChanged || isEmailChanged || isPasswordFilled);
  }, [userDetails, initialValues]);

  return (
    <div className="setting-main-container">
      <h2>Settings</h2>

      <form className="form" onSubmit={handleUpdateForm}>
        <div className="input-main-container">
          <div className="input-container">
            <FontAwesomeIcon icon={faUser} />
            <input
              type="text"
               name="username"
              placeholder="Name"
              onChange={handleInputChange}
              value={userDetails.username || ""}
              disabled={loading}
            />
          </div>
        </div>
        <div className="input-main-container">
          <div className="input-container">
            <FontAwesomeIcon icon={faEnvelope} />
            <input
              type="text"
              name="email"
              placeholder="Update Email"
              onChange={handleInputChange}
              value={userDetails.email || ""}
              disabled={loading}
            />
          </div>
        </div>

        <div className="input-main-container">
          <div className="input-container">
            <FontAwesomeIcon icon={faLock} />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Old Password"
               name="password"
              onChange={handleInputChange}
              value={userDetails.password || ""}
              disabled={loading}
            />
            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} 
               onClick={() => setShowPassword(!showPassword)}
            />
          </div>
        </div>
        <div className="input-main-container">
          <div className="input-container">
            <FontAwesomeIcon icon={faLock} />
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="New Password"
              name="newPassword"
              onChange={handleInputChange}
              value={userDetails.newPassword || ""}
              disabled={loading}
            />
            <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye}
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
             />
          </div>
        </div>

        

        <button   disabled={loading || !isModified} style={{
            cursor: loading || !isModified ? "not-allowed" : "pointer",
            opacity: loading || !isModified ? 0.6 : 1,
          }}  className="btn" type="submit">
         {loading
                  ?  "Updating..."
                  : "Update"}
        </button>
      </form>
    </div>
  );
}

export default Setting;
