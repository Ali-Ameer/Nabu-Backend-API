const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const corsOptions = require("./config/corsOptions");
const credentials = require("./config/credentials");
const mongoose = require("mongoose");
require("dotenv").config();

const AuthController = require("./auth/AuthController")
const UserRoute = require("./routes/UserRoute");
const CourseRoute = require("./routes/CourseRoute");

const app = express();
app.use(cookieParser());

app.use(credentials);
app.use(cors(corsOptions));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());


//enables us to host static CSS & JS files, public folder contains the CSS & JS files.
app.use(express.static("public"));


app.use("/api/auth", AuthController);
app.use("/api/user", UserRoute);
app.use("/api/course", CourseRoute);


// mongo connect & DB
mongoose.set("strictQuery", true);
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB connect successfully ");
  })
  .catch((err) => {
    console.log(err);
  });

app.listen(process.env.PORT || 8000, () => {
  console.log("server is running on port: 8000");
});
