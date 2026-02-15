"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Menu, Search, User } from "lucide-react";
import Sidebar from "./Sidebar";
import UserDropdown from "./UserDropdown";

const Header: React.FC = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <header className="w-full h-20 flex items-center justify-between px-6 bg-gradient-to-r from-[#de2160] via-[#8e21de] to-[#3e21de] text-white shadow-lg relative z-50">
        {/* Left: Menu & Logo */}
        <div className="flex items-center gap-4">
          <button
            className="p-2 rounded-full hover:bg-white/10 transition cursor-pointer"
            onClick={() => setSidebarOpen((prev) => !prev)}
          >
            <Menu size={22} />
          </button>
          <Link
            href="/"
            className="text-3xl font-bold hover:text-zinc-300 transition"
          >
            Cognify
          </Link>
        </div>

        {/* Middle: Search bar */}
        <div className="absolute left-1/2 transform -translate-x-1/2 hidden md:flex items-center w-1/3 bg-white/10 rounded-full px-4 py-2">
          <Search size={18} className="text-white/70" />
          <input
            type="text"
            placeholder="Search assignments..."
            className="bg-transparent outline-none text-lg px-2 w-full text-white placeholder-white/70"
          />
        </div>

        {/* Right: User */}
        <div className="flex items-center gap-4">
          <UserDropdown />
        </div>
      </header>

      {/* Sidebar drops below header */}
      <Sidebar isOpen={isSidebarOpen} />
    </>
  );
};

export default Header;
