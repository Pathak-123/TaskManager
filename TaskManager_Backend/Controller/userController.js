const User=require('../Models/User');
const zod = require("zod");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const Task = require('../Models/Task');

const newUser = async (req, res) => {

    const signupBody = zod.object({
        name: zod.string(),
        email: zod.string().email(),
        password: zod.string()
    });

    const { success } = signupBody.safeParse(req.body);
    if (!success) {
        return res.status(411).json({
          success: false,
          message: "Please enter correct inputs",
        });
      }
    try {

        const { email, name, password } = req.body;

        const existingUser = await User.findOne({ email });


        if (existingUser) {
            return res.status(411).json({
              success: false,
              message: "Email already taken, please try with another Email",
            });
          }

        const salt =  bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);


        const user = await User.create({
            email,
            name,
            password: hash
        })
        const token = jwt.sign({
            _id: user._id,username: name,email:email
        }, process.env.TOKEN_SECRET);

        return res.status(201).json({
            success: true,
            token: token,
            message: `Welcome, ${user.name}`,
        })
    }
    catch (e) {
        return res.status(500).json({
            success: false,
            message: e,
          });

    }
};




const Login = async (req, res) => {

    const signinBody = zod.object({
        email: zod.string().email(),
        password: zod.string()
    });

    const { success } = signinBody.safeParse(req.body)
    if (!success) {
        return res.status(411).json({
          success: false,
          message: "Please enter correct inputs",
        });
      }
    const { email, password } = req.body;

    try {
        const user = await User.findOne({
            email
        });
        if (!user) {
            return res.status(200).json({
              success: false,
              message: "Please enter valid username",
            });
          }

        const userPassword =  bcrypt.compareSync(password, user.password);

        if (!userPassword) {
            return res.status(200).json({
              success: false,
              message: "Invalid Password",
            });
          }

        const token = jwt.sign({ _id: user._id, username: user.name,email:user.email }, process.env.TOKEN_SECRET);
        res.json({
          success: true,
          message: `Welcome, ${user.name}`,
            email: user.email,
            token
        })
    }

    catch (e) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
          });
    }
};


const updateUser = async (req, res) => {
  try {
      const user = req.user;
      if (!user) {
          return res.status(400).json({
              success: false,
              message: "Invalid user",
          });
      }

      const updateUser = await User.findById(user._id);
      if (!updateUser) {
          return res.status(404).json({
              success: false,
              message: "User not found",
          });
      }

      const { username, email, password, newPassword } = req.body;
      let updates = {};
      if ((username && username.trim() !== "" && username !== updateUser.username) || 
      (email && email !== updateUser.email)) {
      if (!password) {
          return res.status(200).json({
              success: false,
              message: "Password is required to update username or email.",
          });
      }

      
      const isPassCorrect = bcrypt.compareSync(password, updateUser.password);
      if (!isPassCorrect) {
          return res.status(200).json({
              success: false,
              message: "Incorrect password provided.",
          });
      }
  }

      if (username && username.trim() !== "" && username !== updateUser.username) {
        updates.name = username;
    }

    if (email && email !== updateUser.email) {
        const emailExists = await User.findOne({ email });
        if (emailExists) {
            return res.status(200).json({
                success: false,
                message: "Email is already taken by another user",
            });
        }
        const emailValidation = zod.object({
            email: zod.string().email()
        });
    
        const { success } = emailValidation.safeParse({email})
        if (!success) {
            return res.status(200).json({
              success: false,
              message: "Please enter correct Email",
            });
          }
          const oldEmail = updateUser.email; 
          await Task.updateMany(
            { assignedTo: oldEmail },
            { assignedTo: email }
          );
          await User.updateMany(
            { myAssignies: oldEmail },
            { $set: { "myAssignies.$": email } } 
          );
        updates.email = email;
    }

      
    if (password && newPassword) {
        const isPassCorrect = bcrypt.compareSync(password, updateUser.password);
        if (!isPassCorrect) {
          return res.status(400).json({
            success: false,
            message: "Incorrect old password",
          });
        }
        if (newPassword === password) {
          return res.status(400).json({
            success: false,
            message: "New Password should not be the same as the previous password",
          });
        }
  
        const salt = bcrypt.genSaltSync(10);
        const hashedPass = bcrypt.hashSync(newPassword, salt);
        updates.password = hashedPass;
      }
      if (Object.keys(updates).length > 0) {
        await updateUser.updateOne(updates);
      }

      res.status(200).json({
          success: true,
          message: "Profile updated successfully",
      });

  } catch (error) {
      res.status(500).json({
          success: false,
          message: "An error occurred while updating profile",
          error: error.message,
      });
  }
};
const addPeople = async (req, res) => {
    try {
        const user = req.user;
        if (!user)            
            if (!user) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid user",
                });
            }   
        const updateUser = await User.findById(user._id);
        const { assigneEmail } = req.body;
        const validEmail = zod.object({
            assigneEmail: zod.string().email()
        });
        const result = validEmail.safeParse({ assigneEmail });
    
        if (!result.success) {
            return res.status(200).json({
              success: false,
              message: "Please enter correct Email",
            });
          }
          const assigneeUser = await User.findOne({ email: assigneEmail });
          if (!assigneeUser) {
              return res.status(200).json({
                  success: false,
                  message: "The provided email is not registered. Please registered first and then assign task.",
              });
          }
  
        if(assigneEmail === updateUser.email)
        {
            return res.status(200).json({
                success: false,
                message: "Yours and add new people email cannot be same.",
              });
        }
         if(updateUser.myAssignies.includes(assigneEmail))
        {
            return res.status(200).json({
                success: false,
                message: "Email already added to assignee.",
              });
        }
        if (assigneEmail) {
            updateUser.myAssignies.push(assigneEmail); 
            await updateUser.save();
        }
        return res.status(200).json({
            success: true,
            message: "Add people successfully!",
        })
      } catch (e) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
          });
      }
};

const getAllMyAssignees = async (req, res) => {
    try {
      const currentUserEmail = req.user.email;
        const users = await User.find({email: { $ne: currentUserEmail } }, 'email name'); 
        const formattedUsers = users.map(user => {
            const username = user.email.split('@')[0]; 

            let displayName = '';
            if (username.includes('.')) {
                const [firstName, lastName] = username.split('.');
                displayName = `${firstName[0].toUpperCase()}${lastName[0].toUpperCase()}`; 
            } else {
                displayName = `${username[0].toUpperCase()}${username[1]?.toUpperCase() || ''}`; 
            }

            return {
                email: user.email,
                name: displayName
            };
        });

        res.status(200).json({
            message: "Users fetched successfully!",
            user: formattedUsers 
        });
    } catch (e) {
        console.error(e); 
        res.status(500).json({ msg: 'An error occurred while fetching users.' });
    }
};

module.exports = { newUser, Login, updateUser,addPeople,getAllMyAssignees}

