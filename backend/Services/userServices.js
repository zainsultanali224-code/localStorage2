import { StatusCodes } from "http-status-codes"
import Todo from "../Models/todo.js";
import paginate from "../utils/pagination.js"
import User from "../Models/user.js"
import bcrypt from "bcrypt";
import { generateToken } from "./auth.js";

// Register User

export const registerService = async (userData) => {
    const { firstName, lastName, email, password } = userData;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
        throw new Error("Email already exists");
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
        firstName,
        lastName,
        email,
        password: hashPassword,
    });

    return newUser;
};

// Login User

export const loginService = async (userData) => {
    const { email, password } = userData;

    const user = await User.findOne({ email })

    if (!user) {
        throw new Error("User not found");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        throw new Error("Invaild password");
    }

    //  Generate JWT

    const token = generateToken({
        id: user._id,
        email: user.email,
    });

    return {
        user,
        token
    }
}

// Get Users

export const getUsers = async () => {
    return await User.find()
}

// Get Single User 

export const singleUser = async (id) => {
    const user = await User.findOne({ _id: id });

    if (!user) {
        throw new Error("User not found");
    }

    return user
}

// Edit User  

export const updateUser = async (id, user) => {
    const editUser = await User.findByIdAndUpdate({ _id: id }, user, {
        returnDocument: "after",
        runValidators: true
    })

    if (!editUser) {
        throw new Error("User not found");
    }
    return editUser
}

// Delete User

export const delUser = async (id) => {
    const user = await User.findByIdAndDelete(id)

    if (!user) {
        throw new Error("User not found");
    }
    return user
}

// Pagination, Search & Sort 

export const paginateService = async (req) => {
    return await paginate(User, req, [
        "firstName",
        "email",
    ])
}