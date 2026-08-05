const express = require("express")
const router = express.Router();

const { createTodo,
    getAllTodos,
    getSingleTodo,
    editTodo,
    deleteTodo,
    paginate,
} = require("../Controller/todoController")

router.post("/", createTodo);
// router.get("/", getAllTodos)
router.get("/", paginate);

router.get("/:id", getSingleTodo);
router.patch("/:id", editTodo);
router.delete("/:id", deleteTodo);

module.exports = router;
