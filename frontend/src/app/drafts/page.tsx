"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { useAuth } from "@/hooks/useAuth";
import { jwtDecode } from "jwt-decode";

interface Blog {
  _id: string;
  title: string;
  content: string;
  tags: string[];
  status: string;
  createdAt: string;
  updatedAt: string;
  author: string;
}

interface DecodedToken {
  id: string;
}

export default function Page() {
  useAuth();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [userId, setUserId] = useState("");

  const backUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      const decoded: DecodedToken = jwtDecode(storedToken);
      setUserId(decoded.id);
    }
  }, []);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch(`${backUrl}/api/blogs`);
        const data = await res.json();
        setBlogs(data);
      } catch (error) {
        console.error("Failed to fetch blogs", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [backUrl]);

  return (
    <>
      <Navbar />
      <main className="min-h-screen w-full max-w-7xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold text-gray-900">Drafts</h1>
        </div>

        {/* Blog List */}
        {loading ? (
          <p className="text-center text-gray-500 mt-10">Loading drafts...</p>
        ) : blogs.filter((blog) => blog.status === "draft").length === 0 ? (
          <p className="text-center text-gray-500 mt-10">No drafts found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {blogs
              .filter(
                (blog) => blog.status === "draft" && blog.author === userId
              )
              .map((blog) => (
                <div
                  onClick={() => router.push(`/blogs/${blog._id}`)}
                  key={blog._id}
                  className="bg-white  p-5 border border-gray-100  rounded-2xl shadow hover:shadow-lg cursor-pointer transition-all duration-300 hover:scale-[1.03] flex flex-col justify-between"
                >
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800 mb-2">
                      {blog.title}
                    </h2>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-3">
                      {blog.content.substring(0, 100)}...
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {blog.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs bg-blue-100 text-blue-600  px-2 py-1 rounded-full font-medium"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="border-t border-gray-200  mt-4 pt-2 text-sm text-gray-500 ">
                    <div className="flex justify-between items-center">
                      <Link href={`/blogs/${blog._id}`}>
                        <span className="text-blue-500 hover:underline">
                          Read More
                        </span>
                      </Link>
                      <span>
                        {new Date(blog.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </main>
    </>
  );
}
