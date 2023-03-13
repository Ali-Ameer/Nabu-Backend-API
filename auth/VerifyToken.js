const jwt = require("jsonwebtoken");

const VerifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (!authHeader?.startsWith("Bearer ")) return res.sendStatus(403);

  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(401);
    req.user = user;
    next();
  });
};

const UserRole = (req, res, next) => {
  VerifyToken(req, res, () => {
    if (
     req.user.role === "student" ||
      req.user.role === "teacher" ||
      req.user.role === "admin"
    ) {
      next();
    } else {
      res.status(403).json("You are not allowed to do that!");
      
    }
  });
};

const TeacherRole = (req, res, next) => {
  VerifyToken(req, res, () => {
    if (req.user.role === "teacher" || req.user.role === "admin") {
      next();
    } else {
      res.status(403).json("You are not allowed to do that! must be Teacher or Admin");
    }
  });
};

const AdminRole = (req, res, next) => {
  VerifyToken(req, res, () => {
    if (req.user.role === "admin") {
      next();
    } else {
      res.status(403).json("You are not allowed to do that! must be Admin");
    }
  });
};

module.exports = { VerifyToken, UserRole, TeacherRole, AdminRole };