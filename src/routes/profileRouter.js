const express = require("express");
const profileRouter = express.Router();
const {userAuth} = require("../middlewares/auth.js");
const {userModel} = require("../models/user.js");
const bcrypt = require("bcrypt");
// profile view
profileRouter.get("/profile/view",userAuth,async (req,res)=>{
    try{
        const user = await userModel.findOne({_id:req.body.userId});
        res.send(user);
    }
    catch(err){
        res.status(400).send("ERROR : "+err.message);
    }
});

// update user API
profileRouter.patch("/profile/edit", userAuth,async (req,res)=>{
    try{
        //const userId = req.params?.userId; *If /user/:userId is used
        const userId = req.body.userId;
        const data = req.body;
        const ALLOWED_UPDATES = ["userId","gender","skills","about","password","age","photoURL","firstName","lastName"];
        let updatingSkills = false;
        const isUpadateAllowed = Object.keys(data).every((k)=>{
            if (!ALLOWED_UPDATES.includes(k)) {
                return false; // If any key is not allowed, return false
            }
            if (k === "skills") {
                updatingSkills = true;
            }
            return true; // Otherwise, allow the key
        })
        if(!isUpadateAllowed){
            return res.status(400).send("Updation is not allowed.");
        }
        if(updatingSkills && req.body.skills.length > 15){
            return res.status(400).send("Skills cannot be more than 15");
        }
        const updatedUser = await userModel.findByIdAndUpdate(userId,data,{
            runValidators:true,
        });
        res.json({
            "message" : `${updatedUser.firstName} is updated.`
        });
    } 
    catch(err){
        res.status(400).send("Something went wrong ! "+err);
    }
});

// update password
profileRouter.patch("/profile/changePassword",userAuth,async (req,res)=>{
    try{
        const userId = req.body.userId;
        const newPassword = req.body.newPassword;
        const newPasswordHash = await bcrypt.hash(newPassword,10);
        const updatedUser = await userModel.findByIdAndUpdate(userId,{password:newPasswordHash},{
            runValidators:true,
        });
        res.send(`${updatedUser.firstName} your password is updated.`);
    }
    catch(err){
        res.status(400).send("ERROR : "+err.message);
    }
});
module.exports = profileRouter;