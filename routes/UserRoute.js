const express = require("express")
const router = express.Router()
const { addUser, getUser, deleteUser, updateUser, updateUserAddCourse } = require("../controllers/userController")
const { UserRole, TeacherRole, AdminRole } = require("../auth/VerifyToken")

// get all users
router.post("/", addUser )
router.get("/:id", getUser )
router.delete("/:id", TeacherRole, deleteUser )
router.put("/:id", UserRole, updateUser )
router.put("/addCourse/:id", UserRole, updateUserAddCourse )

module.exports = router;