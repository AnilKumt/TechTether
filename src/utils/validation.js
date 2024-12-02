const validator = require("validator");

const validateSignUpData = function(req){
    const {firstName,lastName,emailId,password} = req.body;
    if(!firstName || !lastName){
        throw new Error("Enter correct name.");
    }else if(!validator.isEmail(emailId)){
        throw new Error("Enter correct email.");
    }else if(!validator.isStrongPassword(password)){
        throw new Error("Enter strong Password.");
    }
}
const validatelogInData = function(req){
    const {emailId} = req.body;
    if(!validator.isEmail(emailId)){
        throw new Error("Enter correct email.");
    }
}

module.exports = {validateSignUpData,validatelogInData};