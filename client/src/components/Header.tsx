"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import Sidebar from "./Sidebar";
import UserDropdown from "./UserDropdown";
import { useGetAuthUserQuery } from "@/api/authApi";

const Header: React.FC = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const { data: user } = useGetAuthUserQuery();

  return (
    <>
      <header
        className="w-full flex items-center justify-between sticky top-0 z-50"
        style={{
          height: "64px",
          background: "#1A1612",
          borderBottom: "1.5px solid #2a2520",
          fontFamily: "'DM Mono', monospace",
        }}
      >
        {/* Left: menu + logo */}
        <div className="flex items-center gap-4 pl-6">
          <button
            className="flex items-center justify-center cursor-pointer transition-all"
            style={{
              width: "40px",
              height: "40px",
              border: "1px solid transparent",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = "#2a2520";
              (e.currentTarget as HTMLElement).style.background = "#2a2520";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor =
                "transparent";
              (e.currentTarget as HTMLElement).style.background = "transparent";
            }}
            onClick={() => setSidebarOpen((prev) => !prev)}
          >
            <Menu size={18} style={{ color: "#5a5045" }} />
          </button>

          <Link
            href="/"
            style={{
              fontFamily: "'Fraunces', serif",
              fontSize: "22px",
              fontWeight: 300,
              letterSpacing: "-0.02em",
              color: "#F4EFE4",
              textDecoration: "none",
              transition: "opacity 0.15s",
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLElement).style.opacity = "0.7")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLElement).style.opacity = "1")
            }
          >
            cogni
            <em className="italic" style={{ color: "#5548B0" }}>
              fy
            </em>
          </Link>
        </div>

        {/* Center: nav links */}
        <nav className="absolute left-1/2 -translate-x-1/2 hidden md:flex gap-8">
          {[
            { label: "Practice", href: "/practice" },
            { label: "Solve", href: "/solve" },
            { label: "Progress", href: "/dashboard" },
            { label: "About", href: "/about" },
          ].map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-[10px] tracking-[0.15em] uppercase relative"
              style={{
                color: "#5a5045",
                textDecoration: "none",
                transition: "color 0.15s",
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLElement).style.color = "#F4EFE4")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLElement).style.color = "#5a5045")
              }
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right: auth */}
        <div
          className="flex items-stretch h-full"
          style={{ borderLeft: "1.5px solid #2a2520" }}
        >
          {user ? (
            // ── Logged in: show dropdown
            <div className="flex items-center px-2 relative">
              <UserDropdown />
            </div>
          ) : (
            // ── Logged out: sign in / sign up with hover animations
            <>
              <Link
                href="/signin"
                className="flex items-center px-6 text-[10px] tracking-[0.12em] uppercase"
                style={{
                  color: "#8A7D6A",
                  textDecoration: "none",
                  borderRight: "1.5px solid #2a2520",
                  transition: "color 0.15s, background 0.15s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.color = "#F4EFE4";
                  (e.currentTarget as HTMLElement).style.background = "#2a2520";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.color = "#8A7D6A";
                  (e.currentTarget as HTMLElement).style.background =
                    "transparent";
                }}
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="flex items-center px-6 text-[10px] tracking-[0.12em] uppercase"
                style={{
                  background: "#3D3580",
                  color: "#F4EFE4",
                  textDecoration: "none",
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLElement).style.background =
                    "#5548B0")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLElement).style.background =
                    "#3D3580")
                }
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </header>
      <Sidebar isOpen={isSidebarOpen} />
    </>
  );
};

export default Header;
