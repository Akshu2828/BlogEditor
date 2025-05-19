"use client";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Navbar from "../../../../components/Navbar";

interface Blog {
  _id: string;
  title: string;
  content: string;
  tags: string[];
  status: string;
  createdAt: string;
  updatedAt: string;
}

export default function EditBlogPage() {
  const { id } = useParams();
  const [blog, setBlog] = useState<Blog | null>(null);
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [token, setToken] = useState("");

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) setToken(storedToken);
  }, []);
  const backUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  useEffect(() => {
    if (!id) return;
    const fetchBlog = async () => {
      try {
        const res = await fetch(`${backUrl}/api/blogs/${id}`);
        const data = await res.json();
        setBlog(data);
      } catch (err) {
        console.error("Failed to fetch blogs", err);
      }
    };

    fetchBlog();
  }, [id, backUrl]);

  useEffect(() => {
    if (blog) {
      setTitle(blog.title);
      setContent(blog.content);
      setTags(blog.tags.join(", "));
    }
  }, [blog]);

  const handleEditBlog = async () => {
    try {
      const res = await fetch(`${backUrl}/api/blogs/${id}/edit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          content,
          tags: tags.split(",").map((tag) => tag.trim()),
          status: blog?.status,
        }),
      });
      if (res.ok) {
        router.push(`/`);
      }
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <>
      <Navbar />
      <main className="max-w-3xl mx-auto p-6 space-y-8">
        <h1 className="text-4xl font-bold text-gray-900">Edit Blog</h1>

        {!blog ? (
          <p className="text-center text-gray-500 mt-10">Loading blog...</p>
        ) : (
          <>
            {/* Title Input */}
            <div className="space-y-2">
              <label className="block text-gray-700 font-medium text-sm">
                Blog Title
              </label>
              <input
                type="text"
                placeholder="Enter your blog title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border border-gray-300 px-4 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Content Input */}
            <div className="space-y-2">
              <label className="block text-gray-700 font-medium text-sm">
                Blog Content
              </label>
              <textarea
                placeholder="Start writing your blog..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full border border-gray-300 px-4 py-3 rounded-md shadow-sm min-h-[250px] resize-y focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Tags Input */}
            <div className="space-y-2">
              <label className="block text-gray-700 font-medium text-sm">
                Tags
              </label>
              <input
                type="text"
                placeholder="e.g., react, nextjs, mongodb"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="w-full border border-gray-300 px-4 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-400">Separate tags with commas</p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                onClick={handleEditBlog}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition shadow-md"
              >
                {blog?.status === "draft" ? "Save Draft" : "Update Blog"}
              </button>
            </div>
          </>
        )}
      </main>
    </>
  );
}
