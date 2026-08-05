const express = require("express")
const router = express.Router()

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

router.get("/", paginate)

router.get("/:id", getSingleUser)
router.patch("/:id", editUser)
router.delete("/:id", deleteUser)

module.exports = router