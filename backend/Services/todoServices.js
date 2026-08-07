import { StatusCodes } from "http-status-codes"
import Todo from "../Models/todo.js";
import paginate from "../utils/pagination.js"

// create Todo
export const postTodo = async (todoData) => {
    return await Todo.create(todoData)
}

// Get All Todo

export const getTodos = async () => {
    return await Todo.find()
}

// Get Single Todo

export const getTodo = async (id, res) => {
    const todo = await Todo.findById(id)

    if (!todo) {
        throw new Error("Todo not found");
    }

    return todo
}

// Edit Todo
export const updateTodo = async (id, todo) => {
    const todos = await Todo.findByIdAndUpdate(id, todo, {
        returnDocument: "after",
        runValidators: true
    })

    if (!todos) {
        throw new Error("Todo not found");
    }

    return todos
}

// delete Todo

export const delTodo = async (id) => {
    const todo = await Todo.findByIdAndDelete(id)

    if (!todo) {
        throw new Error("Todo not found");
    }

    return todo
}

// Pagination, Search & Sorting  

// export const paginationService = async (filters,options) => {
//     return await paginate(Todo, req, [
//         "title",
//         "description",
//         "location",
//     ])
// }

// 
export const paginationService = async (req) => {
    return await paginate(Todo, req, [
        "title",
        "description",
        "location",
    ])
}
