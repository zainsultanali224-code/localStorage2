const Todo = require("../Models/todo")
const { post } = require("../Routes/TodoRoutes")

// create Todo

const createTodo = async (req, res) => {
    try {
        const todo = await Todo.create(req.body)

        res.status(201).json({
            success: true,
            message: "Todo created succesfully",
            data: todo
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

// Get All Todos

const getAllTodos = async (req, res) => {
    try {
        const todos = await Todo.find()

        res.status(200).json({
            success: true,
            count: todos.length,
            data: todos
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

// Get Single Todo 

const getSingleTodo = async (req, res) => {
    try {

        const todo = await Todo.findById(req.params.id)

        if (!todo) {
            return res.status(404).json({
                success: false,
                message: "Todo not found"
            })
        }

        res.status(200).json({
            success: true,
            data: todo
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

// Edit Todo

const editTodo = async (req, res) => {
    try {
        const id = req.params.id
        const todos = await Todo.findByIdAndUpdate(
            id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        )

        if (!todos) {
            return res.status(404).json({
                success: false,
                message: "Todo not found"
            })
        }

        res.status(200).json({
            success: true,
            data: todos
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

// Delete Todo

const deleteTodo = async (req, res) => {
    try {
        const id = req.params.id;

        const delTodo = await Todo.findByIdAndDelete(id);

        if (!delTodo) {
            return res.status(404).json({
                success: false,
                message: "Todo not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Todo deleted successfully",
            data: delTodo,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Pagination


const paginate = async (req, res) => {
    try {
        const page = parseInt(req.body.page) || 1;
        const perPage = 4;

        const total = 
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

module.exports = {
    createTodo,
    getAllTodos,
    getSingleTodo,
    editTodo,
    deleteTodo
}