const adminAuth = (req,res,next)=>{
    const token = "xyz";
    const isAdminAuthorized = token === "xyz";
    if(!isAdminAuthorized){
        res.status(401).send("Admin is Not Authorized");
    }
    else{
        next();
    }
};

const userAuth = (req,res,next)=>{
    const token = "xyz";
    const isAdminAuthorized = token === "xyz";
    if(!isAdminAuthorized){
        res.status(401).send("user is Not Authorized");
    }
    else{
        next();
    }
};

module.exports = {adminAuth,userAuth};