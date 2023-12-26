const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();

router.get("/", (req, res) => {
  res.json("i work fine");
});

///login without JWT
router.post("/login", async (req, res) => {
  const user = await User.findOne({ username: req.body.username });
  if (user) {
    const validpassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (validpassword) {
      res.json("Logged in");
    } else {
      res.json("Invalid password");
    }
  }
});
///login without JWT

///login with JWT
router.post("/login", async (req, res) => {
  const user = await User.findOne({ username: req.body.username });
  if (user) {
    const validpassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validpassword) {
      res.json("Invalid password");
    }
    const token = await jwt.sign(
      { username: user.username },
      "enteryoursecret"
    );
    res.cookie("jwt", token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
    res.json("Logged in");
  }
});
///login with JWT

router.get("/isauth", async (req, res) => {
  const cookie = await req.cookies.jwt;
  const claims = await jwt.verify(cookie, process.env.SECRET_JWT);
  if (!claims) return res.json("not authenticated");
  const user = await User.findOne({ username: claims.username });
  const { password, ...data } = await user.toJSON();
  res.json(data);
});

router.get("/logout", (req, res) => {
  res.cookie("jwt", "", { maxAge: 0 });
  res.json("Logged out");
});

router.post("/register", async (req, res) => {
  const userexist = await User.findOne({ username: req.body.username });
  if (userexist) {
    res.json("User already exists");
  } else {
    const password = await bcrypt.hash(req.body.password, 10);
    const user = new User({
      username: req.body.username,
      password: password,
    });
    const userdata = await user.save();
    res.send(userdata);
  }
});

module.exports = router;
