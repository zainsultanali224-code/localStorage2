import Todo from "../Models/todo.js";
import asyncHandler from "../utils/handleAsync.js";
import pagination from "../utils/pagination.js";
import logger from "../utils/logger.js";
import { StatusCodes } from "http-status-codes";

// Create Todo
export const createTodo = asyncHandler(async (req, res) => {
    const todo = await Todo.create(req.body);

    res.status(StatusCodes.CREATED).json({
        success: true,
        message: "Todo created successfully",
        data: todo,
    });
});

// Get All Todos
export const getAllTodos = asyncHandler(async (req, res) => {
    const todos = await Todo.find();

    res.status(StatusCodes.OK).json({
        success: true,
        count: todos.length,
        data: todos,
    });
});

// Get Single Todo
export const getSingleTodo = asyncHandler(async (req, res) => {
    const todo = await Todo.findById(req.params.id);

    if (!todo) {
        return res.status(StatusCodes.NOT_FOUND).json({
            success: false,
            message: "Todo not found",
        });
    }

    res.status(StatusCodes.OK).json({
        success: true,
        data: todo,
    });
});

// Edit Todo
export const editTodo = asyncHandler(async (req, res) => {
    const todo = await Todo.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
            new: true,
            runValidators: true,
        }
    );

    if (!todo) {
        return res.status(StatusCodes.NOT_FOUND).json({
            success: false,
            message: "Todo not found",
        });
    }

    res.status(StatusCodes.OK).json({
        success: true,
        data: todo,
    });
});

// Delete Todo
export const deleteTodo = asyncHandler(async (req, res) => {
    const todo = await Todo.findByIdAndDelete(req.params.id);

    if (!todo) {
        return res.status(StatusCodes.NOT_FOUND).json({
            success: false,
            message: "Todo not found",
        });
    }

    res.status(StatusCodes.OK).json({
        success: true,
        message: "Todo deleted successfully",
        data: todo,
    });
});

// Pagination, Search, Sorting
export const paginate = asyncHandler(async (req, res) => {
    const todos = await pagination(Todo, req, [
        "title",
        "description",
        "location",
    ]);

    res.status(StatusCodes.OK).json(todos);
});