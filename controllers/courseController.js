const Course = require("../models/Course");
const mongoose = require("mongoose");


const getAllCourse = async (req, res) => {
    try {
      Course.find({}, { video: 0, teacher: 0}).sort({createdAt: -1})
          .then((data) => {
            return res.status(200).send( data );
          }).catch((err) => {
            return res.status(500).json({ message: "something went wrong !", err });
          });
      } catch (error) {
        return res.status(500).json({ error });
      }
}

const getCourseInfo = async (req, res) => {
    try {
      Course.findById({_id: req.params.id}, {video: 0})
      .populate('teacher', "name image role username")
          .then((data) => {
            return res.status(200).send( data );
          }).catch((err) => {
            return res.status(500).json({ message: "something went wrong !", err });
          });
      } catch (error) {
        return res.status(500).json({ error });
      }
}
const getOneCourse = async (req, res) => {
    try {
      Course.findById({_id: req.params.id}).populate('teacher')
          .then((data) => {
            return res.status(200).send( data );
          }).catch((err) => {
            return res.status(500).json({ message: "something went wrong !", err });
          });
      } catch (error) {
        return res.status(500).json({ error });
      }
}

const addCourse = async (req, res) => {
    try {
        const newCourse = await Course.create({ ...req.body })
          .then((result) => {
            return res.status(200).send({ message: "new Course added successfully", result });
          }).catch((err) => {
            return res.status(500).json({ message: "something went wrong !", err });
          });
      } catch (error) {
        return res.status(500).json({ error });
      }
}

const updateCourse = async (req, res) => {
    const {id} = req.params;
    const findCourse = await Course.findById({_id: id})
    if (!findCourse) return res.status(400).json({message: "can't found course with this id!"})

    try {
        const updateCourse = await Course.findByIdAndUpdate({ _id: id }, { ...req.body })
          .then((result) => {
            return res.status(200).send({ message: "Course are updated successfully", result });
          }).catch((err) => {
            return res.status(500).json({ message: "something went wrong !", err });
          });
      } catch (error) {
        return res.status(500).json({ error });
      }
}

const addNewVideoCourse = async (req, res) => {
    const {id} = req.params;
    const findCourse = await Course.findById({_id: id})
    if (!findCourse) return res.status(400).json({message: "can't found course with this id!"})

    try {
        const updateCourse = await Course.findByIdAndUpdate({ _id: id }, 
          { 
            $push: {video: {title: req.body.video.title, link: req.body.video.link} }
          }
        )
          .then((result) => {
            return res.status(200).send({ message: "Course are updated successfully", result });
          }).catch((err) => {
            return res.status(500).json({ message: "something went wrong !", err });
          });
      } catch (error) {
        return res.status(500).json({ error });
      }
}

const deleteCourse = async (req, res) => {
    const {id} = req.params;
    try {
      const findCourse = await Course.findByIdAndDelete({_id: id})
      .then((result) => {
        res.status(200).json({message: "course are deleted!", result})
      }).catch((error) => {
        res.status(400).json({message: "can't delete course!", error})
      });
      } catch (error) {
        return res.status(500).json({ error });
      }
}

module.exports = { getAllCourse, getOneCourse, getCourseInfo, addCourse, updateCourse, addNewVideoCourse, deleteCourse };