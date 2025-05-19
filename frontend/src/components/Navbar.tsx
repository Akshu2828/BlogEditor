"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

function Navbar() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  // const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
  }, []);

  const logOut = () => {
    localStorage.removeItem("token");
    setToken(null);
    router.push("/");
  };

  return (
    <div className="sticky z-10 top-0 bg-white border-b border-gray-300">
      <div className="flex items-center justify-between h-[10vh] px-4">
        <div className="flex items-center gap-4">
          <p
            onClick={() => router.push("/")}
            className="text-xl font-semibold cursor-pointer"
          >
            Explore
          </p>
        </div>

        <div className="hidden md:flex items-center gap-6">
          <p
            onClick={() => router.push("/editor")}
            className="text-lg cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl font-medium transition-all duration-300 shadow-md hover:scale-105"
          >
            Create Blog
          </p>
          <p
            onClick={() => router.push("/drafts")}
            className="text-lg cursor-pointer bg-gray-500 hover:bg-gray-800 text-white px-5 py-2 rounded-xl font-medium transition-all duration-300 shadow-md hover:scale-105"
          >
            Drafts
          </p>
          {token ? (
            <p
              onClick={logOut}
              className="bg-red-600 text-white font-bold px-4 py-2 rounded-lg cursor-pointer hover:bg-red-700"
            >
              Logout
            </p>
          ) : (
            <p
              onClick={() => router.push("/auth")}
              className="font-bold cursor-pointer"
            >
              Register
            </p>
          )}
        </div>
      </div>
      {/* 
      {menuOpen && (
        <div className="md:hidden px-4 pb-4 flex flex-col gap-4">
          <form onSubmit={handleSearch} className="flex flex-col gap-2">
            <input
              placeholder="Search Destination"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-400 rounded-lg outline-none focus:ring-2 focus:ring-blue-300"
            />
            <button className="bg-red-500 w-fit text-white px-4 py-2 rounded-lg font-bold hover:bg-red-600">
              <FontAwesomeIcon icon={faSearch} className="mr-2" />
              Search
            </button>
          </form>
          <p
            onClick={() => {
              router.push("/createPage");
              setMenuOpen(false);
            }}
            className="text-lg font-medium cursor-pointer"
          >
            Airbnb Your Home
          </p>
          {token ? (
            <p
              onClick={() => {
                logout();
                setMenuOpen(false);
              }}
              className="bg-red-600 w-fit text-white px-4 py-2 rounded-lg font-bold cursor-pointer"
            >
              Logout
            </p>
          ) : (
            <p
              onClick={() => {
                router.push("/authPage");
                setMenuOpen(false);
              }}
              className="font-bold cursor-pointer"
            >
              Register
            </p>
          )}
        </div>
      )} */}
    </div>
  );
}

export default Navbar;
