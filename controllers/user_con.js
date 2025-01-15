const User = require("../models/userSchema");

async function handleSignup(req, res) {
  const { fullName, email, password } = req.body;
  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists." });
    }
    const newUser = new User({ fullName, email, password });
    // Save to the database
    await newUser.save();
    // console.log("User saved successfully!");
    return res.status(200).render("home");
  } catch (error) {
    return res.status(500).json({ error: "Error saving form data." });
  }
}

async function handleSignin(req, res) {
  const { email, password } = req.body;
  try {
    const token = await User.matchPasswordAndGenerateToken(email, password);
    // console.log("Token : ", token);
    return res.cookie("token", token, { httpOnly: true }).redirect("/");
  } catch (error) {
    return res.render("signin", {
      error: "Incorrect Email or Password",
    });
  }
}
async function handleLogout(req, res) {
  res.clearCookie("token").redirect("/");
}

module.exports = { handleSignup, handleSignin, handleLogout };
