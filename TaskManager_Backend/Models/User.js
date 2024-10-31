const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    name:{
        type: String,
        required:true

    },
    email:{
        type: String,
        unique: true,
        required: true,

    },
    password:{
        type: String,
        required: true

    },
    myAssignies: [],
    tasks: [],   
},
{
    timestamps: true,
}
);

module.exports = mongoose.model("User",schema);