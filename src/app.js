const express = require("express");
const {connectDB} = require("./config/database.js");
const {adminAuth,userAuth} = require("./middlewares/auth.js");
const {userModel} = require("./models/user.js");
const app = express();
// connecting to DB and then making server listen at port number 3000
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

// middleware to convert JSON data into javascript object.
app.use(express.json());

// Signup API
app.post("/signup",async (req,res)=>{
    // const newUser =  new userModel({
    //     firstName:"Rahul",
    //     lastName:"abc",
    //     age:20,
    //     emailId:"rahul123@mail.com"
    // });
    const newUser = new userModel(req.body);
    try{
        await newUser.save();
        res.send("Congratulations!.You have signed Up !");
    }
    catch{
        res.send(400).send("Sorry. Unable to signUp Now. Try after some time");
    }

});

// feed API
app.get("/users", async (req,res)=>{
    try{
        const users = await userModel.find({});
        if(users.length==0){
            res.status(404).send("No Recommendations are found");
        }
        else{
            res.send(users);
        }
    } 
    catch{
        res.status(400).send("Something wenr wrong !");
    }
});

// delete user API
app.delete("/user", async (req,res)=>{
    try{
        const userId = req.body.userId;
        const deletedUser = await userModel.findByIdAndDelete(userId);
        res.send(deletedUser.firstName + " is deleted.");
    } 
    catch{
        res.status(400).send("Something went wrong !");
    }
});

// update user API
app.patch("/user", async (req,res)=>{
    try{
        const userId = req.body.userId;
        const data = req.body;
        const updatedUser = await userModel.findByIdAndUpdate(userId,data);
        res.send(updatedUser.firstName + " is updated.");
    } 
    catch{
        res.status(400).send("Something went wrong !");
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
