const mongoose = require("mongoose");
const validator = require("validator");
const userSchema = mongoose.Schema({
    PhotoURL:{
        type: String,
        default:"https://www.google.com/imgres?imgurl=https%3A%2F%2Fas2.ftcdn.net%2Fv2%2Fjpg%2F03%2F46%2F93%2F61%2F500_F_346936114_RaxE6OQogebgAWTalE1myseY1Hbb5qPM.jpg&tbnid=YrjXFFNCMizVwM&vet=10CAwQxiAoBWoXChMI6Leor7iFigMVAAAAAB0AAAAAEAc..i&imgrefurl=https%3A%2F%2Fstock.adobe.com%2Fimages%2Fdefault-profile-picture-avatar-photo-placeholder-vector-illustration%2F346936114&docid=x0JmPyUZl1oSPM&w=500&h=500&itg=1&q=facebook%20profile%20picture&ved=0CAwQxiAoBWoXChMI6Leor7iFigMVAAAAAB0AAAAAEAc",
        validate(value){
            if(!validator.isURL(value)){
                throw new Error("Invalid Image URL");
            }
        }
    },
    firstName:{
        type: String,
        minlength:3,
        maxlength:50,
        require:true
    },
    lastName:{
        type: String,
        minlength:3,
        maxlength:50
    },
    age:{
        type: Number,
        min:10,
        max:120
    },
    emailId:{
        type: String,
        require:true,
        unique:true,
        trim:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid Email.");
            }
        }
    },
    gender:{
        type: String,
        validate(value){
            if(!["male","female","other"].includes(value)){
                throw new Error("Enter correct Gender.");
            }
        }
    },
    password:{
        type: String,
        require:true,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("Please Enter a Strong Password");
            }
        }
    },
    about:{
        type: String,
        default:"This the deafault about me."
    },
    skills:{
        type: {String}
    },
},
{
    timestamps:true,
});

const userModel = mongoose.model("user" , userSchema);

module.exports = {userModel};