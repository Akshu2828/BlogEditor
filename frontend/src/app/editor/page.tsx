"use client";

import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import { useAuth } from "@/hooks/useAuth";

export default function BlogEditor() {
  useAuth();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [autoSaveMessage, setAutoSaveMessage] = useState("");
  const [id, setId] = useState<string | null>(null);
  const [token, setToken] = useState("");

  const router = useRouter();
  const backUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) setToken(storedToken);
  }, []);

  // Auto-save logic
  useEffect(() => {
    if (!title && !content) return;

    const handler = setTimeout(() => {
      handleAutoSave();
    }, 5000);

    return () => clearTimeout(handler);
  }, [title, content, tags]);

  const handleAutoSave = async () => {
    setAutoSaveMessage("Auto-saving...");

    try {
      const res = await fetch(`${backUrl}/api/blogs/save-draft`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id,
          title,
          content,
          tags: tags.split(",").map((tag) => tag.trim()),
          status: "draft",
        }),
      });

      const data = await res.json();

      if (!id && data._id) {
        setId(data._id);
      }

      setAutoSaveMessage("Draft auto-saved");
    } catch {
      setAutoSaveMessage("Failed to auto-save");
    }

    setTimeout(() => setAutoSaveMessage(""), 3000);
  };

  const handlePublish = async () => {
    try {
      await fetch(`${backUrl}/api/blogs/publish`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id,
          title,
          content,
          tags: tags.split(",").map((tag) => tag.trim()),
          status: "published",
        }),
      });
      router.push("/");
    } catch {
      setAutoSaveMessage(" Failed to publish blog. Try again!");
    }
  };

  return (
    <>
      <Navbar />
      <main className="max-w-3xl mx-auto p-6 space-y-8">
        <div className="space-y-1">
          <h1 className="text-4xl font-bold text-gray-900">
            Create a Blog Post
          </h1>
          <p className="text-sm text-gray-500">Auto-saves every 5 seconds.</p>
        </div>

        {/* Autosave Feedback */}
        {autoSaveMessage && (
          <p className="text-sm text-blue-600 font-medium animate-pulse">
            {autoSaveMessage}
          </p>
        )}

        {/* Blog Title */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            Blog Title
          </label>
          <input
            type="text"
            placeholder="Give your blog a catchy title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-gray-300 px-4 py-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>

        {/* Blog Content */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            Blog Content
          </label>
          <textarea
            placeholder="Start sharing your thoughts here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full border border-gray-300 px-4 py-3 rounded-lg min-h-[250px] shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-y"
          />
        </div>

        {/* Tags */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            Tags (comma separated)
          </label>
          <input
            type="text"
            placeholder="e.g. react, blog, javascript"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="w-full border border-gray-300 px-4 py-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap gap-4 pt-4">
          <button
            onClick={handleAutoSave}
            className="bg-gray-600 hover:bg-gray-700 text-white font-semibold px-6 py-2 rounded-lg shadow-sm transition-all"
          >
            Save Draft
          </button>
          <button
            onClick={handlePublish}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded-lg shadow-sm transition-all"
          >
            Publish
          </button>
        </div>
      </main>
    </>
  );
}
