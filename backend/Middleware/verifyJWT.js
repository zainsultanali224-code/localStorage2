import asyncHandler from "../utils/handleAsync.js";
import { verifyJWTToken } from "../Services/auth.js";
import { StatusCodes } from "http-status-codes";

const verifyToken = asyncHandler(async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
            success: false,
            message: "No token provided",
        });
    }

    const token = authHeader.split(" ")[1];

    const decodedToken = verifyJWTToken(token);

    req.user = decodedToken;

    next();
});

export default verifyToken;