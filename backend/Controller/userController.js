const user = require("../Models/user")
const bcrypt = require("bcrypt")

const asyncHandler = require("../utils/handleAsync")
const pagination = require("../utils/pagination")
const { StatusCodes } = require("http-status-codes")


// Register User

const registerUser = asyncHandler(async (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    const existingUser = await user.findOne({ email });

    if (existingUser) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message: "Email already exists",
        });
    }

    const hashPassword = await bcrypt.hash(password, 10)

    const newUser = await user.create({
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
})

// login 

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const foundUser = await user.findOne({ email });


    if (!foundUser) {
        return res.status(StatusCodes.NOT_FOUND).json({
            success: false,
            message: "User not found",
        });
    }

    const isPasswordValid = await bcrypt.compare(password, foundUser.password)

    if (!isPasswordValid) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message: "Invalid password",
        });
    }

    res.status(StatusCodes.OK).json({
        success: true,
        message: "Login successful",
        data: foundUser,
    });
})
// Get User

const getUser = asyncHandler(async (req, res) => {
    const users = await user.find()

    res.status(StatusCodes.OK).json({
        success: true,
        count: users.length,
        data: users
    })
})


// Get single User

const getSingleUser = asyncHandler(async (req, res) => {
    const users = await user.findById(req.params.id)

    if (!users) {
        return res.status(StatusCodes.NOT_FOUND).json({
            success: false,
            message: "User not found"
        })
    }

    res.status(StatusCodes.OK).json({
        success: true,
        data: users
    })
})

// Edit User

const editUser = asyncHandler(async (req, res) => {
    const id = req.params.id
    const users = await user.findByIdAndUpdate(
        id,
        req.body,
        {
            returnDocument: "after",
            runValidators: true
        }
    )

    if (!users) {
        return res.status(StatusCodes.NOT_FOUND).json({
            success: false,
            message: "User not found"
        })
    }

    res.status(StatusCodes.OK).json({
        success: true,
        data: users
    })

})

// Delete User

const deleteUser = asyncHandler(async (req, res) => {
    const id = req.params.id
    const delUser = await user.findByIdAndDelete(id)

    if (!delUser) {
        return res.status(StatusCodes.NOT_FOUND).json({
            success: false,
            message: "user not found",
        });
    }

    res.status(StatusCodes.OK).json({
        success: true,
        message: "User deleted successfully",
        data: delUser
    });


})

// Pagination, Search & Sorting

const paginate = asyncHandler(async (req, res) => {
    const users = await pagination(user, req, [
        "firstName",
        "email",
    ])

    res.status(StatusCodes.OK).json(users);
})


module.exports = {
    registerUser,
    loginUser,
    getUser,
    getSingleUser,
    editUser,
    deleteUser,
    paginate
}