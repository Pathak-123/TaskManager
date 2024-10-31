import React , { useContext, useState } from 'react'
import '../Style/DashboardCardsStyle.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus   } from '@fortawesome/free-solid-svg-icons';
import { VscCollapseAll } from "react-icons/vsc";
import TaskCard from './TaskCard';
import AddTaskModel from './AddTaskModel';
import { PopupContext } from '../utils/TaskContext';


function DashboardCards({title,task,updateTaskType}) {
const [collapseAllChecklists, setCollapseAllChecklists] = useState(true);
const { openCreateTaskPopup,setOpenCreateTaskPopup,handleOpenCreateTaskPopup,selectedTask  } = useContext(PopupContext);

const handleCollapseAll = () => {
  setCollapseAllChecklists(prevState => !prevState);
};
  return (
    <div className='cards-container'>
      <div className='cards-title-container'>
        <h2 >{title}</h2>
        <div style={{ display: "flex", alignItems: "center", gap: "0 0.6rem" }}>
          {title === "To do" && (
           <FontAwesomeIcon
           icon={faPlus}
           style={{cursor:'pointer'}}
           onClick={handleOpenCreateTaskPopup}
         />  
          )}
          <VscCollapseAll size={25} fill="gray"  onClick={handleCollapseAll}
            style={{ cursor: 'pointer' }}/>

            </div>
      </div>

      <div
        className='tasks-container'
        style={{ overflowY: "auto", height: "100%", paddingRight: "1rem" }}
      >
        
        {task?.map((task) => (
          <TaskCard key={task._id} task={task} collapseAllChecklists={collapseAllChecklists}
          updateTaskType={updateTaskType}/>
        ))}
      </div>
      {(openCreateTaskPopup || selectedTask) && (<AddTaskModel
       openCreateTaskPopup={openCreateTaskPopup || !!selectedTask}
        setOpenCreateTaskPopup={setOpenCreateTaskPopup}
        taskData={selectedTask || {}} 
        editingTask={!!selectedTask}
        />)}
    </div>
  )
}

export default DashboardCards