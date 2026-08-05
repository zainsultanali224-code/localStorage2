const express = require("express")
const router = express.Router()
const verifyToken = require("../Middleware/verifyJWT")


const {
    registerUser,
    loginUser,
    getUser,
    getSingleUser,
    editUser,
    deleteUser,
    paginate
} = require("../Controller/userController")

router.post("/register", registerUser)
router.post("/login", loginUser)

router.get("/", verifyToken, paginate)

router.get("/:id", verifyToken, getSingleUser)
router.patch("/:id", verifyToken, editUser)
router.delete("/:id", verifyToken, deleteUser)

module.exports = router