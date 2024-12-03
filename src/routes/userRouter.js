const express = require("express");
const userRouter = express.Router();
const {userModel} = require("../models/user.js");
const {userAuth} = require("../middlewares/auth.js");

// feed API
userRouter.get("/users", async (req,res)=>{
    try{
        const users = await userModel.find({});
        if(users.length==0){
            res.status(404).send("No Recommendations are found");
        }
        else{
            res.send(users);
        }
    } 
    catch(err){
        res.status(400).send("Something wenr wrong !"+err);
    }
});

// delete user API
userRouter.delete("/user", userAuth,async (req,res)=>{
    try{
        const userId = req.body.userId;
        const deletedUser = await userModel.findByIdAndDelete(userId);
        res.send(deletedUser.firstName + " is deleted.");
    } 
    catch(err){
        res.status(400).send("Something went wrong !"+err);
    }
});

module.exports = userRouter;