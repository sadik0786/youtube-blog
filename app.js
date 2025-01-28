require("dotenv").config();
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const { CheckForAuthnticationCookie } = require("./middlewares/authentication");
const Blog = require("./models/blogSchema");
const User = require("./models/userSchema");

// MONGO_URL = mongodb://localhost:27017/blogify
const app = express();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("MongoDB Connected!");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
  }
};

connectDB();
// mongoose.set("debug", true);
const PORT = process.env.PORT || 8000;
// middlewares

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(CheckForAuthnticationCookie("token"));
app.use(express.static(path.resolve("./public")));
app.use(
  session({
    secret: "my secret key",
    saveUninitialized: true,
    resave: false,
  })
);
app.use((req, res, next) => {
  (res.locals.message = req.session.message),
    delete req.session.message,
    next();
});
const userRoute = require("./routes/userRoute");
const blogRoute = require("./routes/blogRoute");
// routes
app.use("/user", userRoute);
app.use("/blog", blogRoute);

app.get("/", async (req, res) => {
  const allBlog = await Blog.find({});
  res.render("home", { user: req.user, blogs: allBlog, title: "Home Page" });
});
// redirect all blog page route
app.get("/all-blog", async (req, res) => {
  const allBlog = await Blog.find({});
  res.render("allblog", {
    user: req.user,
    blogs: allBlog,
    title: "All Blogs",
  });
});

app.listen(PORT, () => {
  console.log(`Server runing on http://localhost:${PORT}`);
});
