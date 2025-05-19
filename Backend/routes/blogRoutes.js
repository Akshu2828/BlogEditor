import { Router } from "express";
import {
  createBlog,
  deleteBlog,
  editBlog,
  getAllBlogs,
  getBlogById,
  saveDraft,
} from "../controllers/blogControllers.js";
import { authentication } from "../middleware/authMiddleware.js";

const router = Router();

// Save or update a draft
router.route("/save-draft").post(authentication, saveDraft);

// create blog
router.route("/publish").post(authentication, createBlog);

// update blog

router.route("/:id/edit").post(authentication, editBlog);

// delete blog

router.route("/:id/delete").delete(authentication, deleteBlog);

// Get all blogs
router.route("/").get(getAllBlogs);

// Get blog by ID
router.route("/:id").get(getBlogById);

export default router;
