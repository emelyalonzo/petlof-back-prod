const dotenv = require("dotenv");
dotenv.config();

const mongoose = require("mongoose");

const mongoDb = process.env.MONGO_DB;

const connectDB = () => mongoose.connect(mongoDb, {
    useNewURlParser: true,
    useUnifiedTopology: true,
});

module.exports = { connectDB, mongoDb };