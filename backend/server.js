const express = require("express");
const connect = require("./config/db")
const { StatusCodes, ReasonPhrases } = require("http-status-codes")

const logger = require("./utils/logger")

const app = express();

const todoRoute = require("./Routes/TodoRoutes")
const userRoute = require("./Routes/userRoute")

connect();

app.use(express.json())

app.use("/api/todos", todoRoute)
app.use("/api/users", userRoute)

app.listen(5000, () => {
    logger.info("Server is running on port 5000")
})