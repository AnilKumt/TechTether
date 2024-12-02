const express = require("express");
const {connectDB} = require("./config/database.js");
const {adminAuth,userAuth} = require("./middlewares/auth.js");
const {userModel} = require("./models/user.js");
const {validateSignUPData} = require("./utils/validation.js");
const bcrypt = require("bcrypt");
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
    try{
        // validating data given by user
        validateSignUPData(req);
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
    catch(err){
        res.status(400).send("Something wenr wrong !"+err);
    }
});

// delete user API
app.delete("/user", async (req,res)=>{
    try{
        const userId = req.body.userId;
        const deletedUser = await userModel.findByIdAndDelete(userId);
        res.send(deletedUser.firstName + " is deleted.");
    } 
    catch(err){
        res.status(400).send("Something went wrong !"+err);
    }
});

// update user API
app.patch("/user/:userId", async (req,res)=>{
    try{
        const userId = req.params?.userId;
        const data = req.body;
        const ALLOWED_UPDATES = ["gender","skills","about","password","age","photoURL","firstName","lastName"];
        let updatingSkills = false;
        const isUpadateAllowed = Objects.keys(data).every((k)=>{
            ALLOWED_UPDATES.includes(k);
            if(k==="skills"){
                updatingSkills=true;
            }
        })
        if(!isUpadateAllowed){
            res.status(400).send("Updation is not allowed.");
        }
        if(updatingSkills && req.body.skills.length > 15){
            res.status(400).send("Skills cannot be more than 15");
        }
        const updatedUser = await userModel.findByIdAndUpdate(userId,data,{
            runValidators:true,
        });
        res.send(updatedUser.firstName + " is updated.");
    } 
    catch(err){
        res.status(400).send("Something went wrong !"+err);
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
