const express = require("express");
const {connectDB} = require("./config/database.js");
const cookieParser = require("cookie-parser");
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
app.use(cookieParser());

const authRouter = require("./routes/authRouter.js");
const profileRouter = require("./routes/profileRouter.js");
const connectionsRouter = require("./routes/connectionsRouter.js");
const userRouter = require("./routes/userRouter.js");

app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",connectionsRouter);
app.use("/",userRouter);


// app.use("/admin",adminAuth,(req,res)=>{
//     res.send("Admin is Verified");
// });

// app.use("/admin",userAuth,(req,res)=>{
//     res.send("user is Verified");
// });

// app.use("/user/:userId",(req,res)=>{
//     console.log(req.query); 
//     /*
//     to get userId we use  "const userId = req.params?.userId; "
//     */
//     res.send("WORKING.........");
// });
