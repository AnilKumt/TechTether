const express = require("express");
const userRouter = express.Router();
const {userModel} = require("../models/user.js");
const {userAuth} = require("../middlewares/auth.js");
const connectionRequest = require("../models/connectionRequests.js");


userRouter.get("/user/myConnections",userAuth, async (req,res)=>{
    try{
        const loggedInUser = req.body.userId;

        // find all connections with fromId-or-toId as loggedInUser also status:accepted.
        const connections = await connectionRequest.find({
            $or:[
                {fromUserId:loggedInUser},
                {toUserId:loggedInUser}
            ],
            status:"accepted"
        })
        if(connections.length==0){
            return res.send("You have no connections as of now.");
        }
        else{
            const populatedConnections = await Promise.all(
                connections.map(async (connection) => {
                    if (connection.fromUserId.toString() === loggedInUser.toString()) {
                        await connection.populate("toUserId", ["firstName", "lastName"]);
                    } else {
                        await connection.populate("fromUserId", ["firstName", "lastName"]);
                    }
                    return connection;
                })
            )
            res.send(populatedConnections);
        }
    }
    catch(err){
        res.status(400).send("ERROR : "+err.message);
    }
});

userRouter.get("/user/request/received",userAuth,async(req,res)=>{
    try{
        const loggedInUSer = req.body.userId;

        const requestsReceived = await connectionRequest.find({
            toUserId:loggedInUSer,
            status:"interested"
        }).populate("fromUserId",["firstName","lastName"]);

        if(requestsReceived.length==0){
            return res.send("You have not received any requests.");
        }
        
        res.send(requestsReceived);
    }catch(err){
        res.send("ERROR : "+err.message);
    }
});
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