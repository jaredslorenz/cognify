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
          className="fixed top-[52px] left-0 bottom-0 w-64
                     bg-[#F4EFE4] z-40 border-r-[1.5px] border-[#1A1612] shadow-[4px_0_24px_rgba(26,22,18,0.08)]"
          initial={{ x: "-100%" }}
          animate={{ x: 0 }}
          exit={{ x: "-100%" }}
          transition={{ type: "spring", stiffness: 200, damping: 25 }}
        >
          <nav
            className="flex flex-col gap-1 px-5 py-6"
            style={{ fontFamily: "'DM Mono', monospace" }}
          >
            {/* Section Title */}
            <span className="text-[10px] uppercase tracking-[0.22em] text-[#8A7D6A] mb-4 px-3">
              Menu
            </span>

            <Link
              href="/dashboard"
              className="flex items-center gap-3 px-3 py-2.5 text-[12px] tracking-wide text-[#4A4035]
                         hover:text-[#3D3580] hover:bg-[#EAE8F5] border-[1.5px] border-transparent
                         hover:border-[#C5C0E8] transition-all"
            >
              <LayoutDashboard size={16} className="text-[#8A7D6A]" />
              Dashboard
            </Link>

            <Link
              href="/solve"
              className="flex items-center gap-3 px-3 py-2.5 text-[12px] tracking-wide text-[#4A4035]
                         hover:text-[#3D3580] hover:bg-[#EAE8F5] border-[1.5px] border-transparent
                         hover:border-[#C5C0E8] transition-all"
            >
              <Edit3 size={16} className="text-[#8A7D6A]" />
              Solve
            </Link>

            <Link
              href="/practice"
              className="flex items-center gap-3 px-3 py-2.5 text-[12px] tracking-wide text-[#4A4035]
                         hover:text-[#3D3580] hover:bg-[#EAE8F5] border-[1.5px] border-transparent
                         hover:border-[#C5C0E8] transition-all"
            >
              <BookOpen size={16} className="text-[#8A7D6A]" />
              Practice
            </Link>

            <div className="border-t-[1.5px] border-[#CEC4AE] my-3 mx-3" />

            <Link
              href="/settings"
              className="flex items-center gap-3 px-3 py-2.5 text-[12px] tracking-wide text-[#4A4035]
                         hover:text-[#3D3580] hover:bg-[#EAE8F5] border-[1.5px] border-transparent
                         hover:border-[#C5C0E8] transition-all"
            >
              <Settings size={16} className="text-[#8A7D6A]" />
              Settings
            </Link>
          </nav>
        </motion.aside>
      )}
    </AnimatePresence>
  );
};

export default Sidebar;
