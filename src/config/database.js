const mongoose = require("mongoose");
const connectDB = async()=>{
    await mongoose.connect("mongodb+srv://anilKumt51:yTnMCP6GZVYj7iR9@nodejs.xuoxi.mongodb.net/TechTether");
}
module.exports = {connectDB};