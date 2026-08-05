const { request } = require("express")
const Todo = require("../Models/todo")
const asyncHandler = require("../utils/handleAsync")
const pagination = require("../utils/pagination")
const logger = require("../utils/logger")
const { StatusCodes, ReasonPhrases } = require("http-status-codes")


// create Todo

const createTodo = asyncHandler(async (req, res) => {
    const todo = await Todo.create(req.body)

    res.status(StatusCodes.CREATED).json({
        success: true,
        message: "Todo created succesfully",
        data: todo
    })
})

// Get All Todos

const getAllTodos = asyncHandler(async (req, res) => {
    const todos = await Todo.find()

    res.status(StatusCodes.OK).json({
        success: true,
        count: todos.length,
        data: todos
    })
})

// Get Single Todo 

const getSingleTodo = asyncHandler(async (req, res) => {
    const todo = await Todo.findById(req.params.id)

    if (!todo) {
        return res.status(StatusCodes.NOT_FOUND).json({
            success: false,
            message: "Todo not found"
        })
    }

    res.status(StatusCodes.OK).json({
        success: true,
        data: todo
    })
})

// Edit Todo

const editTodo = asyncHandler(async (req, res) => {
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
        return res.status(StatusCodes.NOT_FOUND).json({
            success: false,
            message: "Todo not found"
        })
    }

    res.status(StatusCodes.OK).json({
        success: true,
        data: todos
    })

})

// Delete Todo

const deleteTodo = asyncHandler(async (req, res) => {
    const id = req.params.id;

    const delTodo = await Todo.findByIdAndDelete(id);

    if (!delTodo) {
        return res.status(StatusCodes.NOT_FOUND).json({
            success: false,
            message: "Todo not found",
        });
    }

    res.status(StatusCodes.OK).json({
        success: true,
        message: "Todo deleted successfully",
        data: delTodo,
    });
})

// Pagination, Search, Sorting

const paginate = asyncHandler(async (req, res) => {
    const todos = await pagination(Todo, req, [
        "title",
        "description",
        "location",
    ]);

    res.status(StatusCodes.OK).json(todos);
})

module.exports = {
    createTodo,
    getAllTodos,
    getSingleTodo,
    editTodo,
    deleteTodo,
    paginate,
}