// const userModel = require("../models/UserModel");
const User = require("../models/UserModel");
const jwt = require("jsonwebtoken");
const router = require("express").Router();
const bcrypt = require("bcrypt");
router.post("/register", async function (req, res) {
  const { username, email, password } = req.body;
  // console.log(req.body);
  if (!username || !email || !password)
    return res.status(401).json({ message: "Please enter all fields" });
  const userExist = await User.findOne({
    $or: [{ username: username }, { email: email }],
  });
  if (!userExist) {
    const register = new User(req.body);
    try {
      const savedUser = await register.save();
      res.status(201).json({ register, success: true });
    } catch (err) {
      // console.log(err);
      res.status(500).json({ error: err });
    }
  } else {
    return res
      .status(401)
      .json({ success: false, message: "email or username already exsist" });
  }
});
router.post("/login", async (req, res) => {
  // console.log(req.body);
  let login = await User.findOne({ username: req.body.username }).select(
    "+password"
  );

  if (!login) {
    login = await User.findOne({ email: req.body.username }).select(
      "+password"
    );
    // console.log(login);
  }
  // if (!login) {
  //   return res.status(500).json({ error: "Wrong credentials", success: false });
  // }
  try {
    if (login) {
      const { password, ...others } = login._doc;
      const isMatch = await login.comparePassword(req.body.password);
      if (isMatch) {
        // return res.status(200).send("Login successful");
        const accessToken = jwt.sign(
          {
            id: others._id,
            isAdmin: others.isAdmin,
          },
          process.env.JWT_SECRET,
          { expiresIn: "3d" }
        );
        // console.log(accessToken);
        return res.status(200).json({ ...others, accessToken, success: true });
      } else {
        return res
          .status(401)
          .json({ suceess: false, message: "invalid email or password" });
      }
    } else {
      return res
        .status(401)
        .json({ suceess: false, message: "sorry you are not register" });
    }
  } catch (err) {
    return res.status(500).json({ err });
  }
});
router.post("/googleAuth", async (req, res) => {
  try {
    const { data, password: pass } = req.body;

    const user = await User.findOne({ email: data.user.email });
    if (user) {
      const { password, ...others } = user._doc;
      const accessToken = jwt.sign(
        {
          id: others._id,
          isAdmin: others.isAdmin,
        },
        process.env.JWT_SECRET,
        { expiresIn: "3d" }
      );
      return res.status(200).json({ ...others, accessToken, success: true });
    } else {
      const create = await User.create({
        username: data.user.uid,
        email: data.user.email,
        password: pass,
        image: data.user.photoURL,
      });
      await create.save();
      const { password, ...others } = create._doc;
      const accessToken = jwt.sign(
        {
          id: others._id,
          isAdmin: others.isAdmin,
        },
        process.env.JWT_SECRET,
        { expiresIn: "3d" }
      );
      return res.status(200).json({ ...others, accessToken, success: true });
    }
  } catch (err) {
    return res.status(500).json(err);
  }
});
module.exports = router;
