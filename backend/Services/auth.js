import jwt from "jsonwebtoken";

export const generateToken = ({ id, email }) => {
    return jwt.sign(
        { id, email },
        process.env.JWT_SECRET,
        {
            expiresIn: "30d",
        }
    );
};

export const verifyJWTToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET);
};