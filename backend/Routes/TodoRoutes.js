const express = require("express")
const router = express.Router();

const { createTodo,
    getAllTodos,
    getSingleTodo,
    editTodo,
    deleteTodo,
    paginate,
} = require("../Controller/todoController");

const verifyToken = require("../Middleware/verifyJWT");

router.post("/", verifyToken, createTodo);
// router.get("/", getAllTodos)
router.get("/", verifyToken, paginate);

router.get("/:id", verifyToken, getSingleTodo);
router.patch("/:id", verifyToken, editTodo);
router.delete("/:id", verifyToken, deleteTodo);

module.exports = router;
