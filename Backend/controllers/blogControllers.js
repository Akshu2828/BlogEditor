import { Blog } from "../models/Blog.js";

const createBlog = async (req, res) => {
  try {
    const { id, title, content, tags } = req.body;
    const userId = req.user.id;
    if (!title || !content || !tags) {
      return res.status(401).json({ message: "All fields are required!" });
    }

    let blog;
    if (id) {
      blog = await Blog.findByIdAndUpdate(
        id,
        { title, content, tags, status: "published", author: userId },
        { new: true }
      );
    } else {
      blog = new Blog({
        title,
        content,
        tags,
        status: "published",
        author: userId,
      });
      await blog.save();
    }

    res.json(blog);
  } catch (error) {
    return res.status(500).json(error);
  }
};

const editBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, tags, status } = req.body;
    const userId = req.user.id;

    if (!title || !content || !tags || !status) {
      return res.status(400).json({ message: "All fields are required!" });
    }

    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    const isMatched = blog.author.toString() === userId;

    if (!isMatched) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const updatedBLog = await Blog.findByIdAndUpdate(
      id,
      { title, content, tags, status },
      { new: true }
    );

    if (!updatedBLog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.json(updatedBLog);
  } catch (err) {
    return res.status(500).json(err);
  }
};

const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    if (!id) {
      return res.status(401).json({ message: "id is required" });
    }

    const blog = await Blog.findById(id);

    const isMatched = blog.author.toString() === userId;

    if (!isMatched) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const deletedBlog = await Blog.findByIdAndDelete(id);

    if (!deletedBlog) {
      return res.status(401).json({ message: "Blog not found!" });
    }
    res.json({ message: "Blog Deleted!" });
  } catch (err) {
    return res.status(500).json(err);
  }
};

const saveDraft = async (req, res) => {
  try {
    const { id, title, content, tags } = req.body;
    const userId = req.user.id;
    if (!title || !content || !tags) {
      return res.status(401).json({ message: "All fields are required!" });
    }

    let blog;
    if (id) {
      let blog = await Blog.findById(id);

      const isMatched = blog.author.toString() === userId;

      if (!isMatched) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      blog = await Blog.findByIdAndUpdate(
        id,
        { title, content, tags, status: "draft", author: userId },
        { new: true }
      );
    } else {
      blog = new Blog({
        title,
        content,
        tags,
        status: "draft",
        author: userId,
      });
      await blog.save();
    }

    res.json(blog);
  } catch (error) {
    res.status(500).json({ error });
  }
};

const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ updatedAt: -1 });
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ error: "Failed to get blogs" });
  }
};

const getBlogById = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findById(id).populate("author", "username");
    if (!blog) return res.status(404).json({ error: "Blog not found" });
    res.json(blog);
  } catch (error) {
    res.status(500).json({ error: "Failed to get blog" });
  }
};

export {
  createBlog,
  saveDraft,
  getAllBlogs,
  getBlogById,
  editBlog,
  deleteBlog,
};
