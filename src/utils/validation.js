const validator = require("validator");

const validateSignUPData = function(req){
    const {firstName,lastName,emailId,password} = req.body;
    if(!firstName || !lastName){
        throw new Error("Enter correct name.");
    }else if(!validator.isEmail(emailId)){
        throw new Error("Enter email name.");
    }else if(!validator.isStrongPassword(password)){
        throw new Error("Enter strong Password.");
    }
}

module.exports = {validateSignUPData};