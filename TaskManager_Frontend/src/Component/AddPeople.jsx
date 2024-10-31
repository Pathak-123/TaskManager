import React, { useState } from 'react'
import '../Style/AddPeopleStyle.css';
import '../Style/LogoutModelStyle.css';
import { addPeople } from '../services/userServices';
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";

function AddPeople({openAddPeopleModel,setOpenAddPeopleModel}) {
    const [email, setEmail] = useState("");
    const [showSecondModel,setShowSecondModel]=useState(false);
    const [loading, setLoading] = useState(false);

    const handleAddPeople=async(e)=>{
      e.preventDefault();
      toast.dismiss();
      if (!email) {
        toast.error('Email is required');
        return;
      }
      setLoading(true);
      try{
        const response = await addPeople(email);
        if(response.success){
        toast.success(response.message);
        setShowSecondModel(true)
        }
        else{
          toast.error(response.message);
        }

      }catch(err)
    {
      toast.error("Internal Server Error. Please Try Again");
      
    }  finally {
      setLoading(false);
}}

    const handleCloseModal = () => {
      toast.dismiss();
        setEmail("");
       setOpenAddPeopleModel(false);
       setShowSecondModel(false);
      };
  return (
    <div className='add-people-overlay-container'>
      <div className='add-people-container'>
{
    !showSecondModel?(
    <div className='add-people-div'>
    <p>Add people to the board</p>

    <form onSubmit={handleAddPeople} className='add-people-form'>
      <input
        type="text"
        placeholder="Enter email"
        onChange={(e) => setEmail(e.target.value)}
        className='add-people-input'
        disabled={loading}
      />

      <div className='add-people-btns'>
        <button
          onClick={handleCloseModal}
          type="button"
          className='logout-cancel'
          disabled={loading}
        >
          Cancel
        </button>
        <button type="submit" className='popup-logout-btn' style={{
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.6 : 1,
          }} disabled={loading}>
          Add Email
        </button>
      </div>
    </form>
  </div>
    ):
  ( 
     <div className='show-email'>
    <p style={{ textAlign: "center" ,fontWeight:'bold'}}>
   {email}
    </p>
      <button onClick={handleCloseModal} className='popup-logout-btn' style={{textAlign:'center'}}>
        Okay, Got it
      </button>
  </div>)
}
      </div>
    </div>
  )
}

export default AddPeople
