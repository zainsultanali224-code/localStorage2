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

// User Routes

router.get("/", verifyToken, getUser);
router.get("/", verifyToken, paginate);

router.get("/:id", verifyToken, getSingleUser);
router.patch("/:id", verifyToken, editUser);
router.delete("/:id", verifyToken, deleteUser);

export default router;