// connection.js

import mongoose from "mongoose";
import logger from "../utils/logger.js";

const connect = async () => {
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/reactTodo");

        logger.info("MongoDB Connected!");
    } catch (error) {
        logger.error("MongoDB Error", error.message);
        process.exit(1); // Stop the server if DB connection fails
    }
};

export default connect;