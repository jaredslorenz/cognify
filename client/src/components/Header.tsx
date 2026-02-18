"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Menu, Search } from "lucide-react";
import Sidebar from "./Sidebar";
import UserDropdown from "./UserDropdown";

const Header: React.FC = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <header
        className="w-full flex items-center justify-between bg-[#F4EFE4] border-b-[1.5px] border-[#1A1612] sticky top-0 z-50"
        style={{ height: "68px", fontFamily: "'DM Mono', monospace" }}
      >
        {/* Left: menu + logo */}
        <div className="flex items-center gap-4 pl-6">
          <button
            className="flex items-center justify-center border-[1.5px] border-transparent hover:border-[#CEC4AE] hover:bg-[#EAE8F5] transition-all cursor-pointer"
            style={{ width: "40px", height: "40px" }}
            onClick={() => setSidebarOpen((prev) => !prev)}
          >
            <Menu size={18} className="text-[#1A1612]" />
          </button>
          <Link
            href="/"
            className="hover:text-[#3D3580] transition-colors"
            style={{
              fontFamily: "'Fraunces', serif",
              fontSize: "22px",
              fontWeight: 300,
              letterSpacing: "-0.02em",
              color: "#1A1612",
            }}
          >
            cogni
            <em className="italic" style={{ color: "#3D3580" }}>
              fy
            </em>
          </Link>
        </div>

        {/* Center: bordered nav cells */}
        <nav
          className="absolute left-1/2 -translate-x-1/2 hidden md:flex h-full items-stretch"
          style={{
            borderLeft: "1.5px solid #CEC4AE",
            borderRight: "1.5px solid #CEC4AE",
          }}
        >
          {[
            { label: "Practice", href: "/practice" },
            { label: "Solve", href: "/solve" },
            { label: "Progress", href: "/dashboard" },
            { label: "About", href: "/about" },
          ].map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="flex items-center px-7 text-[11px] tracking-[0.1em] uppercase text-[#4A4035] hover:text-[#3D3580] hover:bg-[#F4F3FC] transition-all"
              style={{ borderRight: "1.5px solid #CEC4AE" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right: search + user */}
        <div className="flex items-center gap-3 pr-6">
          <div
            className="hidden lg:flex items-center gap-2 bg-[#FEFAF2] border-[1.5px] border-[#CEC4AE] px-4 py-2 focus-within:border-[#3D3580] transition-colors"
            style={{ width: "200px" }}
          >
            <Search size={13} className="text-[#8A7D6A] flex-shrink-0" />
            <input
              type="text"
              placeholder="Search assignments..."
              className="bg-transparent outline-none w-full placeholder-[#8A7D6A] text-[#1A1612]"
              style={{ fontFamily: "'DM Mono', monospace", fontSize: "12px" }}
            />
          </div>
          <UserDropdown />
        </div>
      </header>

      <Sidebar isOpen={isSidebarOpen} />
    </>
  );
};

export default Header;
