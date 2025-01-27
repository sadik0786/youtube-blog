const express = require("express");
const {
  handleAddBlog,
  handleBlogFind,
  handleBlogDelete,
  handleAddComment,
} = require("../controllers/blog_con");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(`./public/uploads`));
  },
  filename: function (req, file, cb) {
    const fileName = `${Date.now()}-${file.originalname}`;
    cb(null, fileName);
  },
});
const upload = multer({ storage: storage });

const router = express.Router();

// redirect page route
router.get("/add-new", (req, res) => {
  return res.render("addBlog", { user: req.user, title: "Add New Blog" });
});
// save rooute
router.post("/saveBlog", upload.single("coverImage"), handleAddBlog);
// find saved blog route
router.get("/:id", handleBlogFind);
// delete saved blog route
router.get("/delete/:id", handleBlogDelete);
// save comment route
router.post("/comment/:blogId", handleAddComment);

module.exports = router;
