const Blog = require("../models/blogSchema");
const Comment = require("../models/commentSchema");

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
    });
  } catch (error) {
    return res.status(500).json({ error: "Blog not found" });
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

module.exports = { handleAddBlog, handleBlogFind, handleAddComment };
