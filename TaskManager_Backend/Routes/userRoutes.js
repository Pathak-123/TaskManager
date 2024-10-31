const express = require('express');
const {newUser,Login,updateUser, addPeople, getAllMyAssignees} =require('../Controller/userController');
const auth = require('../Middleware/auth');

const router = express.Router(); 

router.post('/signup', newUser);
router.post('/login', Login); 
router.put('/update',auth,updateUser)
router.put('/addPeople', auth, addPeople);
router.get('/getPeople',auth,getAllMyAssignees)

module.exports = router;