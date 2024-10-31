const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
{
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    title:{
        type:String,
        required:true
    },
    priority:{
        type:String,
        enum:['high','low','moderate'],
        required:true,
    },
    type:{
        type:String,
        enum:['todo','progress','done','backlog'],
        required:true
    },
    assignedTo:{
        type:String
    },
    checklist:[{
        checked:Boolean,
        value:String
    },],
    dueDate:{
        type:String
    },
},
{
    timestamps: true,
})
module.exports=mongoose.model("Task",taskSchema);