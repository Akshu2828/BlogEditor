"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "../../../components/Navbar";
import { jwtDecode } from "jwt-decode";

interface Blog {
  _id: string;
  title: string;
  content: string;
  tags: string[];
  status: string;
  createdAt: string;
  author: {
    _id: string;
    username: string;
  };
}

interface DecodedToken {
  id: string;
}

export default function BlogDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState("");

  const [token, setToken] = useState("");

  const backUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      const decoded: DecodedToken = jwtDecode(storedToken);
      setUserId(decoded.id);
    }
  }, []);

  useEffect(() => {
    if (!id) return;

    const fecthBlog = async () => {
      try {
        const res = await fetch(`${backUrl}/api/blogs/${id}`);
        const data = await res.json();
        setBlog(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching blog:", err);
        setLoading(false);
      }
    };

    fecthBlog();
  }, [id, backUrl]);

  const handleDeleteBlog = async () => {
    try {
      const res = await fetch(`${backUrl}/api/blogs/${id}/delete`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(res);

      router.push("/");
    } catch (err) {
      console.error(err);
    }
  };

  const handlePublish = async () => {
    try {
      await fetch(`${backUrl}/api/blogs/publish`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: blog?._id,
          title: blog?.title,
          content: blog?.content,
          tags: blog?.tags,
          status: "published",
        }),
      });
      router.push("/");
    } catch (err) {
      console.log(err);
    }
  };

  if (loading)
    return <p className="p-6 text-center text-gray-500">Loading blog...</p>;
  if (!blog)
    return <p className="p-6 text-center text-red-500">Blog not found</p>;

  return (
    <>
      <Navbar />
      <main className="max-w-4xl mx-auto p-6 space-y-8">
        {/* Back Button */}
        <div>
          {blog.status === "draft" ? (
            <Link href="/drafts">
              <span className="text-blue-600 hover:underline text-sm flex items-center gap-1">
                ← Back to all drafts
              </span>
            </Link>
          ) : (
            <Link href="/">
              <span className="text-blue-600 hover:underline text-sm flex items-center gap-1">
                ← Back to all blogs
              </span>
            </Link>
          )}
        </div>

        {/* Blog Title */}
        <h1 className="text-4xl font-extrabold text-gray-900  tracking-tight leading-snug">
          {blog.title}
        </h1>

        {/* Blog Meta */}
        <div className="flex flex-wrap justify-between text-sm text-gray-500 border-b pb-2 ">
          <span>Author: @{blog?.author.username}</span>
          <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
        </div>

        {/* Blog Content */}
        <article className="prose prose-lg  max-w-none text-gray-800  leading-relaxed whitespace-pre-wrap">
          {blog.content}
        </article>

        {/* Tags */}
        {blog.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 border-t pt-4 ">
            {blog.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs bg-blue-100 text-blue-700  px-3 py-1 rounded-full font-medium"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-wrap gap-4 border-t pt-6">
          {userId === blog.author._id && (
            <div className="flex gap-4">
              {blog.status === "draft" ? (
                <>
                  <button
                    onClick={handlePublish}
                    className="bg-green-600 hover:bg-green-700 text-white font-semibold px-5 py-2 rounded-lg transition-all duration-300 shadow-sm"
                  >
                    Publish
                  </button>
                  <button
                    onClick={() => router.push(`/blogs/${blog._id}/edit`)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-5 py-2 rounded-lg transition-all duration-300 shadow-sm"
                  >
                    Edit Draft
                  </button>
                </>
              ) : (
                <button
                  onClick={() => router.push(`/blogs/${blog._id}/edit`)}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded-lg transition-all duration-300 shadow-sm"
                >
                  Edit Blog
                </button>
              )}
              <button
                onClick={handleDeleteBlog}
                className="bg-red-500 hover:bg-red-700 text-white font-semibold px-5 py-2 rounded-lg transition-all duration-300 shadow-sm"
              >
                {blog.status === "draft" ? "Delete Draft" : "Delete Blog"}
              </button>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
