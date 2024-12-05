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
userRouter.get("/user/feed",userAuth, async (req,res)=>{
    try{
        // Feed should not get 
        // 0.user himself.
        // 1.his connections.
        // 2.people whom he ignored or they ignored him.
        // So, Eventually we donot want people who in DB with HIM (from or to)
        const loggedInUser = req.body.userId;
        const userConnections = await connectionRequest.find({
            $or:[
                {fromUserId:loggedInUser},
                {toUserId:loggedInUser}
            ]
        });
        const hideUsersFromFeed = new Set();
        userConnections.forEach((connection)=>{
            hideUsersFromFeed.add(connection.fromUserId);
            hideUsersFromFeed.add(connection.toUserId);

        });

        const pageNumber = req.query?.page || 1;
        const limitNumber = req.query?.limit || 10;
        const skipNumber = (pageNumber-1)*limitNumber; 
        const usersForFeed = await userModel.find(
            {_id:{ $nin:Array.from(hideUsersFromFeed) }},
            { emailId: 0, password: 0,createdAt:0,updatedAt:0 }   
        ).skip(skipNumber).limit(limitNumber);

        if(usersForFeed.length==0){
            return res.status(400).send("You have no recommendation as of now!");
        }
        res.send(usersForFeed);
    } 
    catch(err){
        res.status(400).send("Something wenr wrong ! "+err.message);
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