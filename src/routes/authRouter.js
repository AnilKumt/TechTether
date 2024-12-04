const express = require("express");
const authRouter = express.Router();
const {validateSignUpData,validatelogInData} = require("../utils/validation.js");
const bcrypt = require("bcrypt");
const {userModel} = require("../models/user.js");
// Signup API
authRouter.post("/signup",async (req,res)=>{
    try{
        // validating data given by user
        validateSignUpData(req);
        const {photoURL,firstName,lastName,emailId,password,gender,age,skills,about} = req.body;

        //Password encrpting
        const passwordHash = await bcrypt.hash(password,10);

        // storing user in DB
        const newUser = new userModel({
            photoURL,firstName,lastName,emailId,password:passwordHash,gender,age,skills,about
        });
        await newUser.save();
        res.send("Congratulations!.You have signed Up !");
    }
    catch(err){
        res.status(400).send("Sorry. Unable to signUp Now."+err);
    }

});

// login API
authRouter.post("/login",async (req,res)=>{
    try{
        // validating data given by user
        validatelogInData(req);
        const {emailId,password} = req.body;

        const user = await userModel.findOne({emailId:emailId}); // Find returns array so,either use findOne or find , then take it's 0th index.
        if(user.length==0){
            throw new Error("Invalid Credentials.");
        }

        const isPasswordCorrect = await bcrypt.compare(password,user.password);
        if(!isPasswordCorrect){
            throw new Error("Invalid Credentials.");
        }

        const token = user.getJWT();
        //console.log(token);
        res.cookie("token",token,{
            expires:new Date(Date.now() + 8*3600000),
        });
        res.send("Logged in successfully !");
    }
    catch(err){
        res.status(400).send(err.message);
    }

});

authRouter.post("/logout",(req,res)=>{
    res.cookie("token",null,{
        expires: new Date(Date.now())
    })
    res.send("Logged out succesfully !");
});
module.exports = authRouter;