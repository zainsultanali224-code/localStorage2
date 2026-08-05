const asyncHandler = require("../utils/handleAsync");
const { verifyJWTToken } = require("../Services/auth");
const { StatusCodes } = require("http-status-codes");

const verifyToken = asyncHandler(async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
            message: "No token provided"
        });
    }
    const token = authHeader.split(" ")[1];

    const decodedToken = verifyJWTToken(token);

    req.user = decodedToken;

    next();
});

module.exports = verifyToken;