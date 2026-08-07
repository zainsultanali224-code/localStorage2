import dotenv from "dotenv";
dotenv.config();

import express from "express";
import connect from "./config/db.js";
import { StatusCodes, ReasonPhrases } from "http-status-codes";
import cors from "cors"
import { rateLimit } from "express-rate-limit"
// import verifyToken from "./Middleware/verifyJWT.js";
import logger from "./utils/logger.js";
import todoRoute from "./Routes/TodoRoutes.js";
import userRoute from "./Routes/userRoute.js";
import corsOption from "./Middleware/corsConfig.js";
import limiter from "./Middleware/rateLimiter.js";

const app = express();

// Connect to Database
connect();

// Middleware
app.use(express.json());

app.use(cors(corsOption))
app.use(limiter)

// Routes
app.use("/api/todos", todoRoute);
app.use("/api/users", userRoute);

// Start Server
app.listen(5000, () => {
    logger.info("Server is running on port 5000");
});