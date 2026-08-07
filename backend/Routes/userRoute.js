import express from "express";
import verifyToken from "../Middleware/verifyJWT.js";

import {
    registerUser,
    loginUser,
    getUser,
    getSingleUser,
    editUser,
    deleteUser,
    paginate,
} from "../Controller/userController.js";

const router = express.Router();

// Authentication Routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Users
router.get("/", verifyToken, paginate);
router.get("/profile/:id", verifyToken, getSingleUser);
router.patch("/profile/:id", verifyToken, editUser);
router.delete("/profile/:id", verifyToken, deleteUser);
export default router;