const express = require("express");
const connect = require("./config/db")
const todoRoute = require("./Routes/TodoRoutes")
const app = express();

connect();

app.use(express.json())

app.use("/api/todos", todoRoute)
app.listen(5000, () => {
    console.log("Server is running on port 5000")
})