const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema({
    fromUserId:{
        type: mongoose.Schema.Types.ObjectId,
        required:true
    },
    toUserId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    status:{
        type:String,
        required:true,
        enum:{
            values:["ignored","interested","accepted","rejected"],
            message:`{VALUE} is not allowed`,
        }
    }
},{
    timestamps:true,
});
connectionRequestSchema.pre("save",function(next){
    const connectionRequest = this;
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){ // here you cannot use fromId == toId beacuse they are not of string type.
        throw new Error("You cannot send request to yourself.");
    }
    next();
});

connectionRequestSchema.index({fromUserId:1 , toUserId:1});

const connectionRequestModel = mongoose.model("connectionRequest",connectionRequestSchema);
module.exports = connectionRequestModel;