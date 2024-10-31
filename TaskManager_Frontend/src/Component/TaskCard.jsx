import React, { useContext, useEffect, useState } from 'react'
import '../Style/TaskCardStyle.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle,faChevronDown, faChevronUp,faEllipsisH   } from '@fortawesome/free-solid-svg-icons';
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import '../Style/PublicPageStyle.css';
import LogoutModel from './LogoutModel';
import AddTaskModel from './AddTaskModel';
import { shareTask } from '../services/taskServices';
import { formatDateToDayMonth, formatToDateObject, getInitials } from '../utils/helperFunction';
import { PopupContext } from '../utils/TaskContext';

function TaskCard({task,collapseAllChecklists,updateTaskType }) {
    const [openTaskSetting, setOpenTaskSetting] = useState(false);
    const [openDeleteTaskModal, setOpenDeleteTaskModal] = useState(false);
    const [showChecklistData, setShowChecklistData] = useState(true);
    const { openEditTaskPopup,setOpenEditTaskPopup,handleOpenEditTaskPopup, selectedTask } = useContext(PopupContext);

const handleShare = async (taskId) => {
  const link = await shareTask(taskId);
  const shareableLink = `${window.location.origin}/${link}`; 
  try {
      await navigator.clipboard.writeText(shareableLink);
      toast.success("Link copied to clipboard!"); 
  } catch (err) {
      toast.error("Failed to copy the link!"); 
      console.error("Could not copy text: ", err);
  }
};

useEffect(() => {
  setShowChecklistData(!collapseAllChecklists);
}, [collapseAllChecklists]);
const taskType=['PROGRESS','TODO','DONE','BACKLOG'];
const checkedCount = task.checklist.filter(item => item.checked).length;
const totalCount = task.checklist.length;
  return (
    <div className='task-card-container'>
    <div className='task-card-priority-container'>
      <div className='task-card-priority'>
      <FontAwesomeIcon icon={faCircle} style={{color:  task.priority === 'low' ? 'green' : 
      task.priority === 'high' ? 'red' : 
      task.priority === 'moderate' ? 'blue' : '#eeecec',
       fontSize:'10px'}}/>
        <p className='task-card-priority-value'>{task.priority}</p>
        {task?.assignedTo && (
          <p title={task?.assignedTo} className='task-assign-name'>
          {getInitials(task?.assignedTo)}
          </p>
        )}
      </div>
      <FontAwesomeIcon
              icon={faEllipsisH}
              style={{ fontSize: '20px', cursor: "pointer"  }}
              onClick={() => setOpenTaskSetting(!openTaskSetting)}


            />
      {openTaskSetting && (
        <div className='task-edit-setting'>
          <p onClick={() => {handleOpenEditTaskPopup(task);setOpenTaskSetting(!openTaskSetting);} }>Edit</p>
          <p onClick={() => {handleShare(task?._id);setOpenTaskSetting(!openTaskSetting);}}>Share</p>
          <p
            style={{ color: "red" }}
            onClick={() => {setOpenDeleteTaskModal(true);setOpenTaskSetting(!openTaskSetting);}}
          >
            Delete
          </p>
        </div>
      )}
{
  openDeleteTaskModal&&(
    <LogoutModel  openLogoutPopup={openDeleteTaskModal}
    setOpenLogoutPopup={setOpenDeleteTaskModal}
    title='Delete'
    id={task._id}/>
  )
}

{openEditTaskPopup && selectedTask && selectedTask._id === task._id && (
      <AddTaskModel
        openCreateTaskPopup={openEditTaskPopup}
        setOpenCreateTaskPopup={setOpenEditTaskPopup}
        taskData={selectedTask}
        editingTask={true}
      />
    )}
    </div>

    <div className='task-title-container'>
      <h1 title={task?.title}>
      {task?.title?.length > 50 ? `${task.title.substring(0, 50)}...` : task.title}
      </h1>

      <div className='task-checklist-container'>
        <p>
        Checklist ({checkedCount}/{totalCount})
        </p>

        {showChecklistData ? (
            <FontAwesomeIcon
            icon={faChevronDown}
            onClick={() => setShowChecklistData(!showChecklistData)}
            size={'sm'}
            className='show-checklist-icon'
          />
        ) : (
            <FontAwesomeIcon
            icon={faChevronUp}
    onClick={() => setShowChecklistData(!showChecklistData)}
           size={'sm'}
            className='show-checklist-icon'
          />
        )}
      </div>
    </div>

    {showChecklistData && (
      <div className='checklist-inputs-container'>
      {task.checklist.map((item, index) => (
              <div className='checklist-inputs' key={index}>
                <input
                  type="checkbox"
                  checked={item.checked}
                  readOnly
                  className='task-checkbox'
                />
                <p className='task'>{item.value}</p>
              </div>
            ))}
      </div>
    )}
    <div className='task-card-btns'>
    {task.dueDate ?
      <div>
          <button className='due-date-btn'  style={{
    backgroundColor: 
     task.type === 'done' ? 'green' :
     formatToDateObject(task.dueDate) < new Date() || task.type === 'backlog' ? 'red' : 'gray',
  }}>{formatDateToDayMonth(task.dueDate)}</button>
    
      </div> : <div></div>
    }

      <div className='task-type-btns' >
      {taskType
    .filter((type) => type !== task.type.toUpperCase())
    .map((type, index) => (
      <button key={index} className="task-type-btn" onClick={()=>updateTaskType(task,type)}>
        {type}
      </button>
    ))}
      </div>
    </div>
  </div>
  )
}

export default TaskCard