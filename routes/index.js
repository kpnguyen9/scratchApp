var express = require("express");
const jwt = require("jsonwebtoken");
var router = express.Router();
require("dotenv").config();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.get("/login", function (req, res, next) {
  res.render("login");
});

router.get("/register", function (req, res, next) {
  res.render("register");
});

const isValidToken = (req, res, next) => {
  const token = req.cookies["userToken"];

  if (token) {
    jwt.verify(token, process.env.SECRET_KEY, function (err, decoded) {
      if (decoded) {
        console.log("this is my payload with my token", decoded);
        next();
      } else {
        res.redirect("/error");
      }
    });
  } else {
    res.redirect("/error");
  }
};

router.get("/profile", isValidToken, function (req, res, next) {
  res.render("profile");
});

module.exports = router;
