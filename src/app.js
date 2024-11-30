const express = require("express");
const {connectDB} = require("./config/database.js");
const {adminAuth,userAuth} = require("./middlewares/auth.js");
const {userModel} = require("./models/user.js");
const app = express();

connectDB()
    .then(()=>{
        console.log("Connected to DB");
        app.listen(3000,()=>{
            console.log("Server is listening at port number 3000...........");
        })
    })
    .catch((err)=>{
        console.log("DB connection failed "+err);
    })

app.post("/signup",async (req,res)=>{
    const newUser =  new userModel({
        firstName:"Rahul",
        lastName:"abc",
        age:20,
        emailId:"rahul123@mail.com"
    });
    try{
        await newUser.save();
        res.send("Congratulations!.You have signed Up !");
    }
    catch{
        res.send(400).send("Sorry. Unable to signUp Now. Try after some time");
    }

});

app.use("/admin",adminAuth,(req,res)=>{
    res.send("Admin is Verified");
});

app.use("/admin",userAuth,(req,res)=>{
    res.send("user is Verified");
});

app.use("/user/:userId",(req,res)=>{
    console.log(req.query);
    res.send("WORKING.........");
});
