const User = require("../models/User");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Joi = require("joi");

const addUser = async (req, res) => {
    try {
      const hashedPassword = bcrypt.hashSync(req.body.password, 10);
      const newUser = await User.create({ ...req.body, password: hashedPassword })
        .then((user) => {
          return res.status(200).json({ message: "user registered successfully", user });
        }).catch((err) => {
          return res.status(400).json({ message: "This email address or username already used before!", err });
        });
    } catch (error) {
      return res.status(500).json({ error });
    }
};


const getUser = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "user id is wrong!" });
  }
  const user = await User.findById(id).populate('courses')
  if (!user) {
    return res.status(404).json({ error: "no such a user" });
  }
  const { password, ...data } = user._doc;
  res.status(200).json({...data});
};

// Delete a user
const deleteUser = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "user id is wrong!" });
  }
  const user = await User.findByIdAndDelete({ _id: id })
    .then((user) => {
      const { password, ...data } = user._doc;
      return res.status(200).json({ message: "user deleted!", ...data });
    })
    .catch((err) => {
      return res.status(500).json({ message: "no user a found!", err: err });
    });
};

// Update a user
const updateUser = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(404).json({ error: "user id is wrong!" });
  }
  try {
  const user = await User.findByIdAndUpdate(
    { _id: id },
    {
      ...req.body,
    },
    {
      new: true
    },
  ).populate('courses').exec()
  if (!user) {
    return res.status(500).json({ message: "no user found!" });
  }
  const { password, ...data } = user._doc;
  return res.status(200).json({ message: "user updated!", ...data });
} catch (error) {
	if (error.code === 11000) {
    return res.status(400).json({message: `this ${Object.keys(error.keyValue)} already used`, error})
	}
	else {
    return res.status(500).json({message: "something went wrong, please tray again later!", error})
	}
}
};

const updateUserAddCourse = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(404).json({ error: "user id is wrong!" });
  }
  try {
    const user = await User.findByIdAndUpdate(
      { _id: id },
      {
        $push: { courses:  req.body.courseId  },
      },
      {new: true}
    ).populate('courses').exec()
    if (!user) {
      return res.status(500).json({ message: "no user found!" });
    }
    const { password, ...data } = user._doc;
    return res.status(200).json({ message: "user updated!", ...data });
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports = { addUser, getUser, deleteUser, updateUser, updateUserAddCourse };