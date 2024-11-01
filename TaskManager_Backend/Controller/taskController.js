const Task=require('../Models/Task');
const User=require('../Models/User');
const mongoose = require("mongoose");
const slugify = require('slugify');

const createTask=async(req,res)=>{
    try{
        const userId = req.user._id;

        const { type, title, priority, assignTo, checklist, dueDate } = req.body;
        console.log(req.body);
        if (!type || !title || !priority || !checklist) {
            return res.status(400).json({
            success : false,
             message: 'All fields are required'
             });
        }
        const task=await Task({
            userId:userId,
            type,
            title,
            dueDate,
            priority,
            checklist,
            assignedTo:assignTo
        });
        await task.save();
        return res.status(201).json({
            success: true,
            message: "Task Created Successfully !" });
    }
    catch(e)
    {
        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
}

const editTask=async(req,res)=>{
    const { type, title, priority, assignedTo, checklist, dueDate } = req.body;
    try{
        const taskId=req.params.taskId;
        const task=  await Task.findById(taskId);

        if(!task)  return res.status(404).json({
            success: false,
            message: 'Task not found'
        });

        if(title) task.title=title;
        if(priority) task.priority=priority;
        if(assignedTo) task.assignedTo=assignedTo;
        if(checklist) task.checklist=checklist;
        if(dueDate) task.dueDate=dueDate;

        await task.save();

         res.status(200).json({
            success: true,
            message: "Task Updated successfully"
        });
    }
    catch(e)
    { 
        return res.status(500).json({
        success: false,
        message: "Server error"
        });
    }
}


const deleteTask=async(req,res)=>{
        try{
            const taskId=req.params.taskId;
            const task=  await Task.findById(taskId);
            if(!task) return res.status(404).json({
                success: false,
                message: 'Task not found'
            });

            await task.deleteOne();
            res.status(200).json({
            success:true,
            message:"Task deleted successfully"
            });
        }
        catch(e)
        {
            return res.status(500).json({
                success: false,
                message: "Server error"
            });
        }
}

const shareTask=async(req,res)=>{
        try{
                const taskId = req.params.taskId;
                const task=  await Task.findById(taskId);
                if(!task)  return res.status(404).json({
                    success: false,
                    message: 'Task not found'
                });
                const shortenedTitle = task.title.length > 20 ? task.title.slice(0, 20) : task.title;
    
                const slugTitle=slugify(shortenedTitle,{lower:true,strict:true});
                const taskLink=`${slugTitle}_${task._id}`;
    
               return res.status(200).json({
                    success:true,
                    taskLink
                });

        }
        catch(e)
        {
                return  res.status(500).json({
                    success: false,
                    message: "Server error"
            });
        }
 }

 const getSharedTask=async(req,res)=>{
    try{
            const { slugID } = req.params;
            const [slug, taskId] = slugID.split('_');
            if (!mongoose.isValidObjectId(taskId)) {
                return res.status(200).json({
                    success: false,
                    message: "Invalid Task ID format",
                });
            }
            const task=  await Task.findById(taskId);
            if(!task) return res.status(200).json({  success: false,message: "Task not found" });

            return res.status(200).json({
                success:true,
                task
            });

    }
    catch(e)
    {
            return res.status(500).json({
                success: false,
                message: "Server error"
        });
    }
}

const getAnalyticsData = async(req,res) => {
    try {
        const userId = req.user._id;
        const userEmail = req.user.email;
        const assignedUsers = await User.find({
            myAssignies: { $in: [userEmail] }
        }).select("_id");

        const assignedUserIds = assignedUsers.map(user => user._id);

        const results = await Task.aggregate([
            {
                $match: {
                    $or: [
                        { userId: new mongoose.Types.ObjectId(userId) }, 
                        { userId: { $in: assignedUserIds } },          
                        { assignedTo: userEmail }                        
                    ]
                }
            },
            {
                $group: {
                    _id: null,
                    backlog: { $sum: { $cond: [{ $eq: ['$type', 'backlog'] }, 1, 0] } },
                    todo: { $sum: { $cond: [{ $eq: ['$type', 'todo'] }, 1, 0] } },
                    inProgress: { $sum: { $cond: [{ $eq: ['$type', 'progress'] }, 1, 0] } },
                    completed: { $sum: { $cond: [{ $eq: ['$type', 'done'] }, 1, 0] } },
                    lowPriority: { $sum: { $cond: [{ $eq: ['$priority', 'low'] }, 1, 0] } },
                    moderatePriority: { $sum: { $cond: [{ $eq: ['$priority', 'moderate'] }, 1, 0] } },
                    highPriority: { $sum: { $cond: [{ $eq: ['$priority', 'high'] }, 1, 0] } },
                    withDueDate: { 
                        $sum: { 
                            $cond: [{ $and: [{ $ne: ['$dueDate', null] }, { $ne: ['$dueDate', ''] }] }, 1, 0] 
                        } 
                    }
                },
            },
        ]);

        const analyticsData = results[0] || {
            backlog: 0,
            todo: 0,
            inProgress: 0,
            completed: 0,
            lowPriority: 0,
            moderatePriority: 0,
            highPriority: 0,
            withDueDate: 0
        };

        res.status(200).json({
            success: true,
            data: analyticsData,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "An error occurred while fetching analytics data.",
            error: error.message,
        });
    }
}
const getTasks=async(req,res)=>{
    try{
        const userId = req.user._id;
        const userEmail = req.user.email;
        const currentDate = new Date();
        let startDate, endDate;
        switch (req.query.period) {
            case "today":
                startDate = new Date(currentDate.setHours(0, 0, 0, 0)); 
                endDate = new Date(currentDate.setHours(23, 59, 59, 999)); 
                break;
            case "week":
                const firstDayOfWeek = new Date(currentDate);
                const currentDay = firstDayOfWeek.getDay(); 
                const daysSinceMonday = currentDay === 0 ? 6 : currentDay - 1; 
                firstDayOfWeek.setDate(firstDayOfWeek.getDate() - daysSinceMonday); 
                
                startDate = new Date(firstDayOfWeek.setHours(0, 0, 0, 0)); 
                const lastDayOfWeek = new Date(firstDayOfWeek);
                lastDayOfWeek.setDate(lastDayOfWeek.getDate() + 6);
                endDate = new Date(lastDayOfWeek.setHours(23, 59, 59, 999)); 
                break;
            case "month":
                startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1); 
                endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0); 
                endDate.setHours(23, 59, 59, 999); 
                break;
            default:
                return res.status(400).json({
                    success: false,
                    message: "Invalid period specified.",
                });
        }
        const assignedUsers = await User.find({
            myAssignies: { $in: [userEmail] }  
        }).select("_id");
        const assignedUserIds = assignedUsers.map(user => user._id);
        const tasks = await Task.find({
            $or: [
                { userId, createdAt: { $gte: startDate, $lte: endDate } },
                { userId: { $in: assignedUserIds }, createdAt: { $gte: startDate, $lte: endDate } },
                { assignedTo: userEmail, createdAt: { $gte: startDate, $lte: endDate } } 
            ],
        });
        const tasksWithFlag = tasks.map(task => ({
            ...task.toObject(),
            isAssigned: assignedUserIds.some(userId => userId.equals(task.userId)) || task.assignedTo === userEmail 
        }));
        
        res.status(200).json({
            success: true,
            tasks: tasksWithFlag,
        });
    }
    catch(e)
    {
        console.log(e);
        res.status(500).json({
            success: false,
            message: "An error occurred while fetching analytics data.",
            error: e.message,
        });
    }
}

const updateType =async(req,res) =>{
    const  {updateTaskType}  = req.body;
    try{
        const taskId=req.params.taskId;
        const task=  await Task.findById(taskId);

        if(!task)  return res.status(404).json({
            success: false,
            message: 'Task not found'
        });

        if(updateTaskType) task.type=updateTaskType;

        await task.save();
        res.status(200).json({
            success: true,
            message: "Task Type Updated successfully"
        });
    }
    catch(e)
    { 
        return res.status(500).json({
        success: false,
        message: "Server error"
        });
    }
}


 
module.exports = { createTask,getTasks,editTask,deleteTask, getAnalyticsData, shareTask,getSharedTask,updateType};