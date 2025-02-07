const express = require("express");
const {
  handleSignup,
  handleSignin,
  handleProfile,
  handleLogout,
} = require("../controllers/user_con");

const router = express.Router();

router.get("/signin", (req, res) => {
  res.render("signin", { title: "Sign In" });
});
router.get("/signup", (req, res) => {
  res.render("signup", { title: "Sign Up" });
});
router.post("/signup", handleSignup);
router.post("/signin", handleSignin);
router.get("/profile", handleProfile);
router.get("/logout", handleLogout);


module.exports = router;
