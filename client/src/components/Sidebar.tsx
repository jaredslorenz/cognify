"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { LayoutDashboard, BookOpen, Edit3, Settings } from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.aside
          className="fixed top-20 left-0 h-[calc(100vh-5rem)] w-64 
                     bg-white shadow-2xl z-40 rounded-tr-2xl rounded-br-2xl border-r border-gray-200"
          initial={{ x: "-100%" }}
          animate={{ x: 0 }}
          exit={{ x: "-100%" }}
          transition={{ type: "spring", stiffness: 200, damping: 25 }}
        >
          <nav className="flex flex-col gap-2 px-6 py-6 text-base font-medium text-gray-800">
            {/* Section Title */}
            <span className="text-xs uppercase tracking-widest text-gray-400 mb-3">
              Menu
            </span>

            <Link
              href="/dashboard"
              className="flex items-center gap-3 px-3 py-2 rounded-lg 
                         hover:bg-gradient-to-r hover:from-[#de2160]/10
                         hover:text-[#de2160] transition"
            >
              <LayoutDashboard size={18} className="text-gray-500" />
              Dashboard
            </Link>

            <Link
              href="/solve"
              className="flex items-center gap-3 px-3 py-2 rounded-lg 
                         hover:bg-gradient-to-r hover:from-[#8e21de]/10 
                         hover:text-[#8e21de] transition"
            >
              <Edit3 size={18} className="text-gray-500" />
              Solve
            </Link>

            <Link
              href="/practice"
              className="flex items-center gap-3 px-3 py-2 rounded-lg 
                         hover:bg-gradient-to-r hover:from-[#3e21de]/10 
                         hover:text-[#3e21de] transition"
            >
              <BookOpen size={18} className="text-gray-500" />
              Practice
            </Link>

            <div className="border-t border-gray-200 my-3"></div>

            <Link
              href="/settings"
              className="flex items-center gap-3 px-3 py-2 rounded-lg 
                         hover:bg-gradient-to-r hover:from-[#727272]/10
                        transition"
            >
              <Settings size={18} className="text-gray-500" />
              Settings
            </Link>
          </nav>
        </motion.aside>
      )}
    </AnimatePresence>
  );
};

export default Sidebar;
