"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGetAuthUserQuery } from "@/api/authApi";
import { LogOut } from "lucide-react";
import { signOut } from "aws-amplify/auth";
import Link from "next/link";

const UserDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data: user, isLoading } = useGetAuthUserQuery();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await signOut();
      window.location.href = "/";
    } catch (err) {
      console.error("Error signing out:", err);
    }
  };

  if (isLoading) return null;

  if (!user) return null; // Header handles logged-out state

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger button */}
      <button
        className="p-2 border-[1.5px] border-transparent transition-all cursor-pointer"
        style={{ transition: "border-color 0.15s, background 0.15s" }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.borderColor = "#2a2520";
          (e.currentTarget as HTMLElement).style.background = "#2a2520";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.borderColor = "transparent";
          (e.currentTarget as HTMLElement).style.background = "transparent";
        }}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <motion.div
          animate={{ rotate: isOpen ? 90 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ color: "#8A7D6A" }}
          >
            <circle cx="12" cy="7" r="4" />
            <path d="M5.5 21a7 7 0 0 1 13 0" />
          </svg>
        </motion.div>
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ y: -12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -12, opacity: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 25 }}
            className="fixed top-[68px] right-0 w-64 bg-[#F4EFE4] z-10"
            style={{
              borderLeft: "1.5px solid #1A1612",
              borderBottom: "1.5px solid #1A1612",
              boxShadow: "-4px 4px 0 #1A1612",
            }}
          >
            <nav
              className="flex flex-col gap-1 px-5 py-5"
              style={{ fontFamily: "'DM Mono', monospace" }}
            >
              <span className="text-[10px] uppercase tracking-[0.22em] text-[#8A7D6A] mb-3 px-2">
                Account
              </span>

              <Link
                href="/dashboard"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 text-[12px] tracking-wide text-[#4A4035] border-[1.5px] border-transparent hover:text-[#3D3580] hover:bg-[#EAE8F5] hover:border-[#C5C0E8] transition-all"
                style={{ textDecoration: "none" }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="15"
                  height="15"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ color: "#8A7D6A" }}
                >
                  <rect x="3" y="3" width="7" height="7" />
                  <rect x="14" y="3" width="7" height="7" />
                  <rect x="14" y="14" width="7" height="7" />
                  <rect x="3" y="14" width="7" height="7" />
                </svg>
                Dashboard
              </Link>

              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-3 py-2.5 text-[12px] tracking-wide text-[#4A4035] hover:text-[#3D3580] hover:bg-[#EAE8F5] border-[1.5px] border-transparent hover:border-[#C5C0E8] transition-all cursor-pointer w-full text-left"
              >
                <LogOut size={15} style={{ color: "#8A7D6A" }} />
                Logout
              </button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserDropdown;
