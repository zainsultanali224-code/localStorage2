// connection

const mongoose = require("mongoose")
const logger = require("../utils/logger")

const connect = async () => {
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/reactTodo")

        logger.info("MongoDB Connected!")
    } catch (error) {
        logger.error("MongoDB Error", error.message)
        process.exit(1); // Server ko stop kar de agar DB connect na ho
    }
}

module.exports = connect 