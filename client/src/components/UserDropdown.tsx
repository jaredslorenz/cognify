"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut } from "lucide-react";
import { signOut } from "aws-amplify/auth";

const UserDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close on outside click
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
      window.location.href = "/signin";
    } catch (err) {
      console.error("Error signing out:", err);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Button */}
      <button
        className="p-2 rounded-full hover:bg-white/10 transition"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <motion.div
          animate={{ rotate: isOpen ? 90 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="22"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-white"
          >
            <circle cx="12" cy="7" r="4" />
            <path d="M5.5 21a7 7 0 0 1 13 0" />
          </svg>
        </motion.div>
      </button>

      {/* Dropdown sliding from header */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 25 }}
            className="fixed top-20 right-0 w-72 
                       bg-white shadow-2xl rounded-bl-2xl border-l border-b border-gray-200 z-10"
          >
            <nav className="flex flex-col gap-2 px-6 py-6 text-base font-medium text-gray-800">
              <span className="text-xs uppercase tracking-widest text-gray-400 mb-3">
                Account
              </span>

              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-3 py-2 rounded-lg 
                         hover:bg-gradient-to-r hover:from-[#727272]/10
                        transition cursor-pointer"
              >
                <LogOut size={18} className="text-gray-500" />
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
