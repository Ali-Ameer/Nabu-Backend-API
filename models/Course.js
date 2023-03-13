const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    default: "https://cdn.icon-icons.com/icons2/2506/PNG/512/user_icon_150670.png",
  },
  video: {
    type: [{title: String, link: String}]
  },
  category: {
    type: String,
    required: true,
  },
  rating:{
    type: Number,
  },
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
},
{ timestamps: true }
);

module.exports = mongoose.model("Course", courseSchema);
