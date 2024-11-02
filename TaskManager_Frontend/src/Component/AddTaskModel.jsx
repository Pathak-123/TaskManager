import React, { useContext, useEffect, useState } from 'react'
import '../Style/AddTaskModelStyle.css';
import '../Style/PublicPageStyle.css';
import '../Style/TaskCardStyle.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle ,faTrash,faPlus ,faChevronDown, faLeftLong} from '@fortawesome/free-solid-svg-icons';
import { createTask, updateTask } from '../services/taskServices';
import { toast } from 'react-toastify';
import { getAssignee } from '../services/userServices';
import { PopupContext } from '../utils/TaskContext';
import { parseDate } from '../utils/helperFunction';
function AddTaskModel({openCreateTaskPopup,setOpenCreateTaskPopup,taskData,editingTask}) {
  const [showAssigneeDropdown, setShowAssigneeDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [assignee,setAssignee] = useState([]);
  const { openEditTaskPopup,setSelectedTask } = useContext(PopupContext);
  const [showDatePicker, setShowDatePicker] = useState(false); 
    const [task, setTask] = useState({
        title: "",
        type: "todo",
        priority: "",
        checklist: [],
        assignTo: "",
        dueDate: '',
      }); 
      useEffect(() => {
        if (editingTask && taskData && openEditTaskPopup) {
          setTask({
            title: taskData.title || "",
            type: taskData.type || "todo",
            priority: taskData.priority || "",
            checklist: taskData?.checklist || "",
            assignTo: taskData?.assignedTo || "",
            dueDate: taskData.dueDate || "",
          });
        }
      }, [editingTask,taskData]);
    
    
    const handleCreateTask = async (e) => {
        e.preventDefault();
        toast.dismiss();
        if(task?.title=== '' || task.priority==='')
        {
          toast.error('Please fill all mandatory fields');
          return ;
        }
        if (task?.checklist?.length <3) {
          toast.error('Please add at least three checklist item.');
          return;
        }
    
    const hasCheckedItem = task.checklist.some(item => item.checked);
    const allChecklistItemsHaveValues = task.checklist.every(item => item.value.trim() !== '');

    if(!hasCheckedItem)
    {
      toast.error('Please check at least one checklist item.');
      return;
    }
    if (!allChecklistItemsHaveValues) {
      toast.error('Please fill all checklist values.');
      return;
  }
    
    setLoading(true);
       try{
        let response;
        if (editingTask) {
          response = await updateTask(task,taskData._id);
        }
        else{
         response=await createTask(task);
        }
        if(response.success){
          toast.success(response.message);
          setOpenCreateTaskPopup(!openCreateTaskPopup);
          window.location.reload();
          setTask({
            title: "",
            type: "todo",
            priority: "",
            checklist: [
            ],
            assignTo: "",
            dueDate: "",
          });

        }
        
        else{
          toast.error(response.message);
          setLoading(false);
        }
       }catch(e)
       {
        toast.error("Sever Error. Please Try Again")     
        }
        finally {
          setLoading(false);
        }
    }
  const handleAddChecklist=()=>{
    setTask(prevTask => ({
      ...prevTask,
      checklist: [...prevTask.checklist, { checked: false, value: '' }],
    }));
    }
const handleDeleteCheckList=(index)=>{

  setTask(prevTask=>({
    ...prevTask,
    checklist:prevTask.checklist.filter((_,i)=>i!==index)

  }))
}
    const handleCancel = () => {
      setOpenCreateTaskPopup(false);
      setTask({
        title: "",
        type: "todo",
        priority: "",
        checklist: [
        ],
        assignTo: "",
        dueDate: "",
      });
      if (editingTask) {
        setSelectedTask(null); 
      }

    };
  const handleChangeTitle = (title) => {
    setTask(prev => ({ ...prev, title }));

  };
  const handleChangePriority = (priority) => {
    setTask(prev => ({ ...prev, priority }));  };

   
    const handleChangeAssignee = (asignee) => {
        setTask(prev => ({ ...prev, assignTo: asignee }));
        setShowAssigneeDropdown(!showAssigneeDropdown)
      };
  const handleChangeOptionCheckList = (index) => {
    setTask(prevTask => {
      const updatedChecklist = prevTask.checklist.map((item, i) =>
        i === index ? { ...item, checked: !item.checked } : item
      );
      return { ...prevTask, checklist: updatedChecklist };
    });

  };
  const handleChangeOptionTaskTitle = (index, checkedTitle) => {
    setTask(prevTask => ({
      ...prevTask,
      checklist: prevTask.checklist.map((item, i) =>
        i === index ? { ...item, value: checkedTitle } : item
      ),
    }));
  };
  const handleDateChange = (date) => {
    if(date){
      const formattedDate = date.toLocaleDateString('en-GB');
    setTask(prevTask => ({
      ...prevTask,
      dueDate: formattedDate,
    }));
    setShowDatePicker(false);
  }
  };

  useEffect(()=>{
    const fetchAssignees = async () => {
      try {
        const response = await getAssignee();
        setAssignee(response);
      } catch (error) {
        console.error('Error fetching assignees:', error);
      }
    };

    fetchAssignees();
  },[])

  return (
    <div className='add-task-container-overlay'>
        <div className='add-task-container'>
        {showDatePicker && (
          <div className="date-picker-overlay">
            <DatePicker
selected={task.dueDate ? parseDate(task.dueDate) : null} onChange={handleDateChange}
              inline  
            />
          </div>
        )}
        <form className='add-task-form' onSubmit={handleCreateTask}>
        <div className='add-task-top-container'>
          <label htmlFor="title">
            Title <span className='required-field'>*</span>
          </label>
          <input
            onChange={(e) => handleChangeTitle(e.target.value)}
            type="text"
            id="title"
            placeholder="Enter Task Title"
            value={task.title}
          />
        </div>
        <div className='add-task-priority-container'>
          <h4 className='select-priority'>
            Select Priority <span className='required-field'>*</span>
          </h4>

          <button
            onClick={() => handleChangePriority("high")}
            type="button"
            className={`add-task-priority ${task.priority === 'high' ? 'active-priority':''}`}
          >
            <FontAwesomeIcon icon={faCircle} style={{color:"#ff2473" , fontSize:'10px'}}/>
            <p>HIGH PRIORITY</p>
          </button>
          <button
            onClick={() => handleChangePriority("moderate")}
            type="button"
            className={`add-task-priority ${task.priority === 'moderate' ? 'active-priority':''}`}
          >
            <FontAwesomeIcon icon={faCircle} style={{color:"blue" , fontSize:'10px'}}/>
            <p>MODERATE PRIORITY</p>
          </button>
          <button
            onClick={() => handleChangePriority("low")}
            type="button"
            className={`add-task-priority ${task.priority === 'low' ? 'active-priority':''}`}
          >
            <FontAwesomeIcon icon={faCircle} style={{color:"green" , fontSize:'10px'}}/>
            <p>LOW PRIORITY</p>
          </button>
        </div>

       
        <div className='add-task-assign-container'>
            <p>Assign to</p>
            <div className='custom-dropdown' onClick={() => !(editingTask && taskData?.isAssigned) && setShowAssigneeDropdown(!showAssigneeDropdown)}   style={{
    cursor: editingTask && taskData?.isAssigned ? 'not-allowed' : 'pointer',
    color: editingTask && taskData?.isAssigned ? 'grey' : 'inherit',
    pointerEvents: editingTask && taskData?.isAssigned ? 'none' : 'auto',
    backgroundColor: editingTask && taskData?.isAssigned ? '#f0f0f0' : 'inherit',
  }}>
              {task.assignTo || 'Select an assignee'}
              <FontAwesomeIcon
            icon={faChevronDown}
            size={"sm"}
            style={{
      color: editingTask && taskData?.isAssigned ? 'grey' : 'inherit',
      pointerEvents: editingTask && taskData?.isAssigned ? 'none' : 'auto',
    }}
            onClick={() => !(editingTask && taskData?.isAssigned) && setShowAssigneeDropdown(!showAssigneeDropdown)}
          />
            </div>
          </div>
        
        <div className='add-task-checklist-container'>
        {showAssigneeDropdown && (
              <div className='dropdown-menu'>
              <div 
      className='dropdown-item' 
      onClick={() => handleChangeAssignee('')}
    >
      <span style={{ marginLeft: '2rem' }}>Select an assignee</span>
    </div>
                {assignee.map((user, index) => (
                  <div key={index} className='dropdown-item' onClick={() => handleChangeAssignee(user.email)}>
                    <span className='task-assign-name'>{user.name}</span>
                    <span className='user-email'>{user.email}</span>
                    <button type="button"
                      className="add-task-due-date-btn" 
                      onClick={() => { handleChangeAssignee(user.email)}}
                    >
                      Assign
                    </button>
                  </div>
                ))}
              </div>
            )} 
          <p>
          Checklist ({(task.checklist || []).filter(item => item.checked).length}/{(task.checklist || []).length})
          <span className='required-field'>*</span>
          </p>
          
          <div className='add-task-checklist-inputs'>
            {
             task.checklist.map((checklistItem, index) => (
                <div  className='add-task-checklist-input-container' key={index}>
                <div className='add-task-checklist-input'>
                  <input
                    type="checkbox"
                    checked={checklistItem.checked}
                    className='input-checklist'
                    onChange={(e) =>
                        handleChangeOptionCheckList(index)
                    }
                  />
                  <input
                    style={{ border: "none", outline: "none", width: "100%" ,color:'black'}}
                    type="text"
                    className='add-task-input-filed'
                    placeholder="Task content"
                    value={checklistItem.value}   
                    onChange={(e) => handleChangeOptionTaskTitle(index,e.target.value)}
                  />
                </div>
                <FontAwesomeIcon icon={faTrash} style={{ fontSize: '14px', color: 'red' ,cursor: "pointer" }} onClick={()=>handleDeleteCheckList(index)}/>
              </div>
             ))       
            }  
              
          </div>

          <div className='add-new-task-filed' onClick={handleAddChecklist}>
          <FontAwesomeIcon
           icon={faPlus}
           style={{cursor:'pointer',fontSize: '14px', }}
         />  
            Add New
          </div>
          
        </div>

       

        <div className='add-task-btns'>
          <div>
            <button
              onClick={()=>
                setShowDatePicker(!showDatePicker)
               }
              type="button"
              className='add-task-due-date-btn'
            >
              {task?.dueDate
                ? task?.dueDate
                : "Select due date"}
            </button>
          </div>

          <div className='add-task-btn'>
            <button
              onClick={handleCancel}
              type="button"
              className='logout-cancel'
              style={{color:'red', borderColor:'red',width:'150px',height:'40px',padding:'0px',fontSize:'16px'}}
            >
              Cancel
            </button>
            <button type="submit" className='popup-logout-btn'  style={{borderRadius:'10px',width:'150px',height:'40px',padding:'0px',fontSize:'16px',cursor: loading ? "not-allowed" : "pointer"}} onClick={handleCreateTask}>
            {loading
                  ? editingTask
                    ? "Updating..."
                    : "Saving..."
                  : editingTask
                  ? "Update"
                  : "Save"}
            </button>
          </div>
        </div>
      </form>
    </div>  
    </div>
  )
}

export default AddTaskModel