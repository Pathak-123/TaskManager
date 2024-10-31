import React, { createContext, useState } from 'react';

export const PopupContext = createContext();

export const PopupProvider = ({ children }) => {
const [openCreateTaskPopup,setOpenCreateTaskPopup]=useState(false);
const [openEditTaskPopup,setOpenEditTaskPopup]=useState(false);
const [selectedTask, setSelectedTask] = useState(null);


const handleOpenCreateTaskPopup=()=>{
    setSelectedTask(null);
    setOpenCreateTaskPopup(!openCreateTaskPopup);
}
const handleOpenEditTaskPopup = (task) => {
    setSelectedTask(task); 
    setOpenEditTaskPopup(true);
  };
return (
    <PopupContext.Provider value={{openCreateTaskPopup,setOpenCreateTaskPopup,handleOpenCreateTaskPopup,openEditTaskPopup,setOpenEditTaskPopup,selectedTask,setSelectedTask,handleOpenEditTaskPopup }}>
      {children}
    </PopupContext.Provider>
  );
};