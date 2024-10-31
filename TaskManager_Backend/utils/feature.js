const mongoose = require("mongoose");

 const connectDB=(uri)=>{
    mongoose.connect(uri,{
        dbName:"Task_Manager_App"
    }).then((c) => console.log(`DB connected to ${c.connection.host}`))
    .catch((e)=> console.log("error"));

};
module.exports = connectDB;