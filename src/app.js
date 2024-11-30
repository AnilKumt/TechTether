const express = require("express");
const {connectDB} = require("./config/database.js");
const {adminAuth,userAuth} = require("./middlewares/auth.js");
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
