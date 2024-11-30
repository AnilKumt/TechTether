const express = require("express");

const app = express();
const {adminAuth,userAuth} = require("./middlewares/auth.js");
app.listen(3000,()=>{
    console.log("Server is running on Port 3000..........")
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