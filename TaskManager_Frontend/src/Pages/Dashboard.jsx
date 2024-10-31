import React, { useEffect, useState } from 'react'
import '../Style/DashboardStyle.css';
import { IoPeopleOutline } from "react-icons/io5";
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';

import DashboardCards from '../Component/DashboardCards';
import AddPeople from '../Component/AddPeople';
import { getWelcomeData } from '../utils/helperFunction';
import { getTasksData, updateType } from '../services/taskServices';
import Loader from '../Component/Loader';

function Dashboard() {
    const [currentPeriod, setCurrentPeriod] = useState("week");
    const [openAddPeopleModel,setOpenAddPeopleModel]=useState(false)
    const [loading, setLoading] = useState(true);
    
    
    const [tasksValue, setTasksValue] = useState({
      backlog: [],
      todo: [],
      progress: [],
      done: []
  });
  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
        try {
            const response = await getTasksData(currentPeriod);
            if(response.success){
              const tasks = response.tasks;
              const sortedTasks = {
                backlog: tasks.filter(task => task.type === 'backlog'),
                todo: tasks.filter(task => task.type === 'todo'),
                progress: tasks.filter(task => task.type === 'progress'),
                done: tasks.filter(task => task.type === 'done')
            };
              setTasksValue(sortedTasks);

            }
            
        } catch (error) {
            console.error("Error fetching tasks:", error);
        }
        finally {
          setLoading(false); 
      }
    };

    fetchTasks();
}, [currentPeriod]);

const updateTaskType = async (task, newType) => {
  const taskCategory = task.type.toLowerCase();
  const newCategory = newType.toLowerCase();
  const previousTasksValue = { ...tasksValue };
  setTasksValue(prevTasks => {
       const updatedCurrentCategory = prevTasks[taskCategory]?.filter(t => t._id !== task._id);
      const updatedTask = { ...task, type: newType };
      const updatedNewCategory = [...prevTasks[newCategory], updatedTask];

      return {
          ...prevTasks,
[taskCategory]: updatedCurrentCategory,
          [newCategory]: updatedNewCategory
      };
  });
  try {
    const response = await updateType(newType.toLowerCase() , task._id);

    if (!response.success) {
        toast.error("Failed to update task type");
        setTasksValue(previousTasksValue); 
    }
} catch (error) {
    console.error("Error updating task type:", error);
    setTasksValue(previousTasksValue); 
}
};
    const { username, currentDate } = getWelcomeData();
  return (
    <div className='dashboard-container'>
    <div className='welcome-container'>
      <h1 >
      Welcome! {username}
      </h1>
      <p>{currentDate}</p>
    </div>

    <div className='dashboard-header'>
      <div className='dashboard-header-container'>
        <p className='title-board'>Board</p>
        <div className='add-people-icon' onClick={()=>setOpenAddPeopleModel(true)}>

        <IoPeopleOutline style={{ fontSize: '15px', color: 'gray' }} />
          <p>Add People</p>
        </div>
        {openAddPeopleModel&&(
<AddPeople setOpenAddPeopleModel={setOpenAddPeopleModel} openAddPeopleModel={openAddPeopleModel}/>
        )
}
      </div>

      <select
         value={currentPeriod}
        onChange={(e) => setCurrentPeriod(e.target.value)}
      >
        <option value="today">Today</option>
        <option value="week">This Week</option>
        <option value="month">This Month</option>
      </select>
    </div>
    {loading ? ( 
                <Loader />
            ) : (

    <div className='cards'>
      <DashboardCards title="Backlog" task={tasksValue.backlog} updateTaskType={updateTaskType}/>
      <DashboardCards title="To do" task={tasksValue.todo} updateTaskType={updateTaskType}/>
      <DashboardCards title="In progress" task={tasksValue.progress} updateTaskType={updateTaskType}/>
      <DashboardCards title="Done" task={tasksValue.done} updateTaskType={updateTaskType}/>
    </div>
  )}
  </div>
  )
}

export default Dashboard
