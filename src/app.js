const express = require("express");

const app = express();

app.listen(3000,()=>{
    console.log("Server is running on Port 3000..........")
});

app.use("/",(req,res)=>{
    res.send("WORKING.........");
});