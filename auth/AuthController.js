const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
var mongoose = require("mongoose");
const User = require("../models/User");

const generateAccessToken = (data) => {
  return jwt.sign({ id: data._id, role: data.role }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "10s",
  });
};
const refreshAccessToken = (data) => {
    return jwt.sign({ id: data._id, role: data.role }, process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "7d" }
      );
};

router.post("/login", async (req, res) => {
  const cookies = req.cookies;
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: "Email and password are required." });

  const foundUser = await User.findOne({ email }).populate('courses').exec();
  if (!foundUser) return res.status(401).json({ message: "no user found!" }); //Unauthorized

  // evaluate password
  const matchPassword = await bcrypt.compare(password, foundUser.password);
  if (matchPassword) {

    const accessToken = generateAccessToken(foundUser);
    const refreshToken = refreshAccessToken(foundUser);

    if (cookies?.refreshToken) {
      res.clearCookie("refreshToken", { httpOnly: true, secure: true, sameSite: "none" });
    }

    // Creates Secure Cookie with refresh token
    res.cookie("refreshToken", refreshToken, 
        {httpOnly: true, secure: true, sameSite: "none", maxAge: 7 * 24 * 60 * 60 * 1000 }
    );

    // don't send password to user
    const { password, ...data } = foundUser._doc;

    // Send user data and access token to user
    res.status(200).json({ ...data, accessToken });
  } else {
    res.sendStatus(401);
  }
});

// create new refresh token
router.get("/refreshToken", async (req, res) => {
    const cookies = req.cookies;
  
    if (!cookies?.refreshToken) return res.status(401).json({ message: "no cookies found!" });

    const refreshToken = cookies.refreshToken;
    res.clearCookie("refreshToken", { httpOnly: true, secure: true, sameSite: "none" });
  
    // compare refresh token !
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, decoded) => {
        if (err) return res.status(403).json({ message: "invalid refresh token!", err }); //Forbidden
  
        // Refresh token was still valid
        const accessToken = generateAccessToken(decoded);
        const refreshToken = refreshAccessToken(decoded);
    
        // Creates Secure Cookie with refresh token
        res.cookie("refreshToken", refreshToken,
            { httpOnly: true, secure: true, sameSite: "none", maxAge: 7 * 24 * 60 * 60 * 1000 }
        );
  
        return res.json({ accessToken });
      }
    );
  });

module.exports = router;