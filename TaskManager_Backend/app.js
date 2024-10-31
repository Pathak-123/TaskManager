const express=require('express');
const cors=require('cors');
const dotenv = require('dotenv');
const connectDB = require('./utils/feature');
dotenv.config();
const app=express();
const port= process.env.PORT || 3000;
const mongoURI= process.env.MONGO_URI || "";
const userRoute=require('./Routes/userRoutes')
const taskRoute=require('./Routes/taskRoutes')

connectDB(mongoURI);
app.use(express.json());
app.use(cors());

app.use("/api/v1/user", userRoute);
app.use("/api/v1/task", taskRoute);


app.listen(port,()=>{
    console.log(`Server is working on localhost: ${port}`);
})