import User from "../Models/user.js";
import bcrypt from "bcrypt";
import asyncHandler from "../utils/handleAsync.js";
import pagination from "../utils/pagination.js";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import { generateToken } from "../Services/auth.js";

// Register User
export const registerUser = asyncHandler(async (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message: "Email already exists",
        });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
        firstName,
        lastName,
        email,
        password: hashPassword,
    });

    res.status(StatusCodes.CREATED).json({
        success: true,
        message: "User registered successfully",
        data: newUser,
    });
});

// Login User
export const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const foundUser = await User.findOne({ email });

    if (!foundUser) {
        return res.status(StatusCodes.NOT_FOUND).json({
            success: false,
            message: "User not found",
        });
    }

    const isPasswordValid = await bcrypt.compare(password, foundUser.password);

    if (!isPasswordValid) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message: "Invalid password",
        });
    }

    // Generate JWT
    const token = generateToken({
        id: foundUser._id,
        email: foundUser.email,
    });

    res.status(StatusCodes.OK).json({
        success: true,
        message: "Login successful",
        token,
        data: foundUser,
    });
});

// Get All Users
export const getUser = asyncHandler(async (req, res) => {
    const users = await User.find();

    res.status(StatusCodes.OK).json({
        success: true,
        count: users.length,
        data: users,
    });
});

// Get Single User
export const getSingleUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        return res.status(StatusCodes.NOT_FOUND).json({
            success: false,
            message: "User not found",
        });
    }

    res.status(StatusCodes.OK).json({
        success: true,
        data: user,
    });
});

// Edit User
export const editUser = asyncHandler(async (req, res) => {
    const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
            new: true,
            runValidators: true,
        }
    );

    if (!updatedUser) {
        return res.status(StatusCodes.NOT_FOUND).json({
            success: false,
            message: "User not found",
        });
    }

    res.status(StatusCodes.OK).json({
        success: true,
        data: updatedUser,
    });
});

// Delete User
export const deleteUser = asyncHandler(async (req, res) => {
    const deletedUser = await User.findByIdAndDelete(req.params.id);

    if (!deletedUser) {
        return res.status(StatusCodes.NOT_FOUND).json({
            success: false,
            message: "User not found",
        });
    }

    res.status(StatusCodes.OK).json({
        success: true,
        message: "User deleted successfully",
        data: deletedUser,
    });
});

// Pagination, Search & Sorting
export const paginate = asyncHandler(async (req, res) => {
    const users = await pagination(User, req, [
        "firstName",
        "email",
    ]);

    res.status(StatusCodes.OK).json(users);
});