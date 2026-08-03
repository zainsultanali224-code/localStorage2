const express = require("express")
const router = express.Router();

const { createTodo,
    getAllTodos,
    getSingleTodo,
    editTodo
} = require("../Controller/todoController")

router.post("/", createTodo),
    router.get("/", getAllTodos)
router.get("/:id", getSingleTodo)
router.patch("/:id", editTodo)


module.exports = router;
