import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    title: String,
    content: String,
    tags: [String],
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Blog = mongoose.model("Blog", blogSchema);

export { Blog };
