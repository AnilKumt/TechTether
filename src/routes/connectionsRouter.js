const express = require("express");
const connectionRequestRouter = express.Router();
const {userAuth} = require("../middlewares/auth");
const connectionRequest = require("../models/connectionRequests")
const {userModel} = require("../models/user");

connectionRequestRouter.post("/request/send/:status/:userId",userAuth,async (req,res)=>{
    try{
        const fromUserId = req.body.userId;
        const toUserId = req.params?.userId;
        const status = req.params?.status;

        if(!["interested","ignored"].includes(status)){
            throw new Error("Status is invalid.");
        }
        const toUser = await userModel.findOne( { _id: toUserId } );
        if(!(toUser)){
            throw new Error("User not Found");
        }

        const doRequestAlreadyExist = await connectionRequest.findOne({
            $or:[
                {fromUserId,toUserId},
                {fromUserId:toUserId,toUserId:fromUserId}
            ]
        });

        if(doRequestAlreadyExist){
            throw new Error("Request Already exist.")
        }

        const request = new connectionRequest({
            fromUserId,
            toUserId,
            status
        });

        await request.save();

        if(status=="interested"){
            res.json({
                "message":"connection Request is send to "+toUser.firstName,
                request
            })
        }
        else{
            res.json({
                "message":toUser.firstName+" is ignored",
                request
            })
        }

    }
    catch(err){
        res.status(400).send("ERROR : "+err.message);
    }
});

connectionRequestRouter.post("/request/review/:status/:requestId",userAuth,async (req,res)=>{
    try{
        const loggedInUser = req.body.userId;
        const requestId = req.params?.requestId;
        const status = req.params?.status;

        // validate stauus.
        if(!["accepted","rejected"].includes(status)){
            throw new Error("Status is invalid.");
        }
        // validate requestId with requestId and loggedInUser
        const request = await connectionRequest.findOneAndUpdate( { 
            _id: requestId,toUserId:loggedInUser } ,
            { status :status},
            {new:true}
        );
        if(!(request)){
            throw new Error("User not Found");
        }

        res.json({
            "message": "you have "+request.status+" the user with userId : "+request.fromUserId,
            request
        })

    }
    catch(err){
        res.status(400).send("ERROR : "+err.message);
    }
});

module.exports = connectionRequestRouter;