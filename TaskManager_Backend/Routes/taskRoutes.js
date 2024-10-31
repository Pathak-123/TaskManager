const express = require('express');
const {createTask, editTask, deleteTask, shareTask, getSharedTask, getAnalyticsData, getTasks, updateType} =require('../Controller/taskController');
const authMiddleware = require('../Middleware/auth');

const router = express.Router(); 
router.post('/createTask', authMiddleware, createTask);
router.get('/getTask',authMiddleware,getTasks);
router.put('/editTask/:taskId',authMiddleware,editTask);
router.delete('/delete/:taskId', deleteTask);

router.get('/shareTask/:taskId',authMiddleware,shareTask);

router.patch('/task/:taskId',authMiddleware, updateType);

router.get('/analyticsData', authMiddleware, getAnalyticsData);

router.get('/getSharedTask/:slugID',getSharedTask);
module.exports = router;