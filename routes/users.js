var express = require("express");
var router = express.Router();
const bcrypt = require("bcrypt");
require("dotenv").config();
const saltRounds = bcrypt.genSaltSync(Number(process.env.SALT_FACTOR));
const { User } = require("../models/");
const jwt = require("jsonwebtoken");

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

router.post("/register", async (req, res, next) => {
  const { username, password, email } = req.body;
  const hashed = bcrypt.hashSync(password, saltRounds);

  const user = await User.create({
    username: username,
    password: hashed,
    email: email,
  });

  res.json({
    id: user.id,
    username: user.username,
  });

  console.log("registered new user");
});

router.post("/login", async (req, res, next) => {
  const { username, password } = req.body;

  const user = await User.findOne({
    where: {
      username: username,
      //first username is the title of the column in db, second username is the username from the body
    },
  });

  if (user) {
    const comparePasswords = bcrypt.compareSync(password, user.password);
    if (comparePasswords) {
      const token = jwt.sign(
        {
          data: user.username,
        },
        process.env.SECRET_KEY,
        { expiresIn: "1h" }
      );

      res.cookie("userToken", token);

      res.redirect("/profile");
    } else {
      res.send("incorrect password, try again");
    }
  } else {
    res.send("cannot find user");
  }
});

module.exports = router;
