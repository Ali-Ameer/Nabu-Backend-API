const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  role: {
    type: String,
    default: "student",
    enum: ["student", "teacher", "admin"]
  },
  image: {
    type: String,
    default: "https://cdn.icon-icons.com/icons2/2506/PNG/512/user_icon_150670.png",
  },
  courses:  [{type: mongoose.Schema.Types.ObjectId, ref: 'Course'}],
  accessToken: {
    type: String,
  },
},
{ timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
