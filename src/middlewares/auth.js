const jwt = require("jsonwebtoken");
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

const userAuth = async (req, res, next) => {
    try {
        // Ensure token exists in cookies
        const { token } = req.cookies;
        if (!token) {
            return res.status(401).send("Access denied. No token provided.");
        }

        const SECRET_KEY = "techTether$1234"; // Use environment variable for secret key
        const decodedMessage = await jwt.verify(token, SECRET_KEY); // Verify the JWT

        const { _id } = decodedMessage;
        req.body.userId = _id; // Attach user ID to request body for further use

        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).send("Invalid token.");
        } else if (error.name === 'TokenExpiredError') {
            return res.status(401).send("Token has expired.");
        }
        return res.status(500).send("Internal server error."+error.message);
    }
};

module.exports = {adminAuth,userAuth};