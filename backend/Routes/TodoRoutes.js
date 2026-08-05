import express from "express";
import {
    createTodo,
    getAllTodos,
    getSingleTodo,
    editTodo,
    deleteTodo,
    paginate,
} from "../Controller/todoController.js";

import verifyToken from "../Middleware/verifyJWT.js";

const router = express.Router();

router.post("/", verifyToken, createTodo);

// router.get("/", verifyToken, getAllTodos);
router.get("/", verifyToken, paginate);

router.get("/:id", verifyToken, getSingleTodo);
router.patch("/:id", verifyToken, editTodo);
router.delete("/:id", verifyToken, deleteTodo);

export default router;