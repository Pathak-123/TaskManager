import React , { useEffect, useState }from 'react'
import '../Style/PublicPageStyle.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle } from '@fortawesome/free-solid-svg-icons';
import { useParams } from "react-router-dom";
import LogoImage from '../assets/logo.svg';
import { getSharedTask } from '../services/taskServices';
import Loader from '../Component/Loader';
import { getInitials } from '../utils/helperFunction';


function PublicPage() {
  const { slugID } = useParams(); 
    const [task, setTask] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const fetchTaskData = async () => {
        try {
          const task = await getSharedTask(slugID);
          setTask(task);
          setLoading(false);
        } catch (error) {
          console.error('Failed to fetch quiz data:', error.message);
        }
        finally{
          setLoading(false);
        }
      };
  
      fetchTaskData();
    }, [slugID]);
    const checkedCount = Array.isArray(task.checklist) ? task.checklist.filter(item => item.checked).length : 0;
    const totalCount = Array.isArray(task.checklist) ? task.checklist.length : 0;

  

  return (
    <div className='public-main-container'>
    <div className='logo-heading'>
      <img src={LogoImage} alt="logo" />
      <p>Pro Manage</p>
    </div>

    {loading ? (
      < Loader />
    )  : (

      <div className='main-div'>
        <div className='main-div-center'>
          <div className='priority-main-container'>
            <div className='priority-container'>
              <FontAwesomeIcon icon={faCircle} style={{color: task?.priority === "low"
                    ? "#63c05b"
                    : task.priority === "moderate"
                    ? "#18b0ff"
                    : "#ff2473" , fontSize:'10px'}}/>

              <p>{task?.priority} Priority</p>

              {task.assignedTo && (
                <p title={task?.assignedTo} className='task-assign'> {getInitials(task.assignedTo)}</p>
              )}
            </div>
          </div>

          <div className='title-div'>
            <h1 title={task?.title} className='task-title'>
            {task?.title}

            </h1>

            <div className='checklist'>
              <p>
                Checklist ({checkedCount}/{totalCount})
              </p>
            </div>
          </div>

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
          {task.dueDate && (
            <div className='due-date-container'>
              <p className='due-date'>Due Date</p>
              <button className='due-date-btn'>{task.dueDate}</button>
            </div>
          )}
        </div>
      </div>
    )}
  </div>
  )
}

export default PublicPage
