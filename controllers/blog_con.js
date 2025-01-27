const Blog = require("../models/blogSchema");
const Comment = require("../models/commentSchema");
const User = require("../models/userSchema");
const fs = require("fs");

async function handleAddBlog(req, res) {
  const { title, body } = req.body;
  // const file = req.file ? req.file.path : null; working
  const file = `/uploads/${req.file.filename}`;
  try {
    const blog = new Blog({
      title,
      body,
      coverImageURL: file,
      createdBy: req.user._id,
    });
    await blog.save();
    return res.status(200).redirect("/");
  } catch (error) {
    return res.status(500).json({ error: "Blog not added" });
  }
}
async function handleBlogFind(req, res) {
  try {
    const blog = await Blog.findById(req.params.id).populate("createdBy");
    const comment = await Comment.find({ blogId: req.params.id }).populate(
      "createdBy"
    );
    console.log("comment", comment);
    return res.render("blog", {
      user: req.user,
      blogs: blog,
      comments: comment,
      title: "View Blog",
    });
  } catch (error) {
    return res.status(500).json({ error: "Blog not found" });
  }
}
async function handleBlogDelete(req, res) {
  const id = req.params.id;
  try {
       const blog = await Blog.findById(id);
       if (!blog) {
         return res.status(404).json({ error: "User not found" });
       }
       // Delete the user's image if it exists
       if (blog.coverImageURL && fs.existsSync(blog.coverImageURL)) {
         try {
           fs.unlinkSync(blog.coverImageURL);
         } catch (err) {
           console.error("Error deleting image:", err);
         }
       }
    const response = await Blog.findByIdAndDelete(id);
    req.session.message = {
      type: "danger",
      message: "User deleted successfully!",
    };
    res.redirect("/all-blog");
  } catch (error) {
    console.error("Error during deletion:", error);
    return res
      .status(500)
      .json({ error: "Internal server error", message: err.message });
  }
}
// add comment
async function handleAddComment(req, res) {
  const { content } = req.body;
  try {
    const comment = new Comment({
      content,
      blogId: req.params.blogId,
      createdBy: req.user._id,
    });
    await comment.save();
    return res.status(200).redirect(`/blog/${req.params.blogId}`);
  } catch (error) {
    return res.status(500).json({ error: "Comment not added" });
  }
}

module.exports = {
  handleAddBlog,
  handleBlogFind,
  handleBlogDelete,
  handleAddComment,
};
