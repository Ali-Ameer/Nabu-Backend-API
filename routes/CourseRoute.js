const express = require("express")
const router = express.Router()
const { getAllCourse, getOneCourse, getCourseInfo, addCourse, updateCourse, addNewVideoCourse, deleteCourse } = require("../controllers/courseController")
const { UserRole, TeacherRole, AdminRole } = require("../auth/VerifyToken")

// get all users
router.get("/", getAllCourse )
router.get("/info/:id", getCourseInfo )
router.get("/:id",  UserRole, getOneCourse )
router.post("/", TeacherRole, addCourse )
router.put("/:id", TeacherRole, updateCourse )
router.put("/newvideo/:id", TeacherRole, addNewVideoCourse )
router.delete("/:id", TeacherRole, deleteCourse )

module.exports = router;