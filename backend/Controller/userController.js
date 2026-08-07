import User from "../Models/user.js";
import bcrypt from "bcrypt";
import asyncHandler from "../utils/handleAsync.js";
import pagination from "../utils/pagination.js";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import { generateToken } from "../Services/auth.js";
import { delUser, getUsers, loginService, paginateService, registerService, singleUser, updateUser, } from "../Services/userServices.js";

// Register User
export const registerUser = asyncHandler(async (req, res) => {
    // const { firstName, lastName, email, password } = req.body;

    const newUser = await registerService(req.body);

    // if (existingUser) {
    //     return res.status(StatusCodes.BAD_REQUEST).json({
    //         success: false,
    //         message: "Email already exists",
    //     });
    // }

    // const hashPassword = await bcrypt.hash(password, 10);

    // const newUser = await User.create({
    //     firstName,
    //     lastName,
    //     email,
    //     password: hashPassword,
    // });

    res.status(StatusCodes.CREATED).json({
        success: true,
        message: "User registered successfully",
        data: newUser,
    });
});

// Login User

export const loginUser = asyncHandler(async (req, res) => {
    // const { email, password } = req.body;

    const { user, token } = await loginService(req.body);

    // if (!foundUser) {
    //     return res.status(StatusCodes.NOT_FOUND).json({
    //         success: false,
    //         message: "User not found",
    //     });
    // }

    // const isPasswordValid = await bcrypt.compare(password, foundUser.password);

    // if (!isPasswordValid) {
    //     return res.status(StatusCodes.BAD_REQUEST).json({
    //         success: false,
    //         message: "Invalid password",
    //     });
    // }

    // // Generate JWT
    // const token = generateToken({
    //     id: foundUser._id,
    //     email: foundUser.email,
    // });

    res.status(StatusCodes.OK).json({
        success: true,
        message: "Login successful",
        token,
        data: user,
    });
});

// Get All Users
export const getUser = asyncHandler(async (req, res) => {
    const users = await getUsers();

    res.status(StatusCodes.OK).json({
        success: true,
        count: users.length,
        data: users,
    });
});

// Get Single User
export const getSingleUser = asyncHandler(async (req, res) => {
    const user = await singleUser(req.params.id);

    res.status(StatusCodes.OK).json({
        success: true,
        data: user,
    });
});

// Edit User
export const editUser = asyncHandler(async (req, res) => {
    const updatedUser = await updateUser(req.params.id, req.body);

    res.status(StatusCodes.OK).json({
        success: true,
        data: updatedUser,
    });
});

// Delete User
export const deleteUser = asyncHandler(async (req, res) => {
    const deletedUser = await delUser(req.params.id);

    res.status(StatusCodes.OK).json({
        success: true,
        message: "User deleted successfully",
        data: deletedUser,
    });
});

// Pagination, Search & Sorting
export const paginate = asyncHandler(async (req, res) => {
    const users = await paginateService(req)

    res.status(StatusCodes.OK).json(users);
});