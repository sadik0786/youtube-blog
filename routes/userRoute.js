const express = require("express");
const {
  handleSignup,
  handleSignin,
  handleLogout,
} = require("../controllers/user_con");

const router = express.Router();

router.get("/signin", (req, res) => {
  res.render("signin");
});
router.get("/signup", (req, res) => {
  res.render("signup");
});
router.post("/signup", handleSignup);
router.post("/signin", handleSignin);
router.get("/logout", handleLogout);

module.exports = router;
