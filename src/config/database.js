const mongoose = require("mongoose");
console.log(process);
const DB_URL = process.env.MONGODB_URL;
const connectDB = async()=>{
    await mongoose.connect(DB_URL);
}
module.exports = {connectDB};