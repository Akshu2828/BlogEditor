"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import Navbar from "../../components/Navbar";

export default function AuthPage() {
  const router = useRouter();

  const [mode, setMode] = useState<"register" | "login">("register");
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");

  const backUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const endpoint =
      mode === "register"
        ? `${backUrl}/user/register`
        : `${backUrl}/user/login`;

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      console.log(data);
      if (res.ok) {
        setMessage(
          `${mode === "register" ? "Registered" : "Logged in"} Successfully!`
        );
        if (mode === "login") {
          localStorage.setItem("token", data?.token);
          router.push("/");
        }
      } else {
        console.log(data);
        setMessage(` ${data.message}`);
      }
    } catch (err) {
      console.log(err);
      setMessage(`${err}`);
    }
  };

  return (
    <>
      <Navbar />
      <div className="p-4 max-w-md h-[80vh] mx-auto flex flex-col justify-center">
        <h2 className="text-2xl text-red-500 font-bold mb-4 text-center">
          {mode === "register" ? "Register" : "Login"}
        </h2>
        {message && <p className="mt-4 text-center">{message}</p>}

        <form onSubmit={handleSubmit} className="space-y-3 flex flex-col">
          {mode === "register" && (
            <input
              type="text"
              name="username"
              placeholder="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full p-2 border border-gray-400 rounded-lg outline-none focus:ring-2 focus:ring-blue-300"
              required
            />
          )}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 border border-gray-400 rounded-lg outline-none focus:ring-2 focus:ring-blue-300"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-2 border border-gray-400 rounded-lg outline-none focus:ring-2 focus:ring-blue-300"
            required
          />
          <button
            type="submit"
            className="bg-black text-white font-semibold px-4 py-2 rounded w-auto mx-auto cursor-pointer hover:bg-gray-800 transition duration-200"
          >
            {mode === "register" ? "Register" : "Login"}
          </button>
        </form>

        <p className="mt-4 text-center">
          {mode === "register"
            ? "Already have an account?"
            : "Don't have an account?"}{" "}
          <button
            onClick={() => setMode(mode === "register" ? "login" : "register")}
            className="text-blue-500 underline"
          >
            {mode === "register" ? "Login" : "Register"}
          </button>
        </p>
      </div>
    </>
  );
}
