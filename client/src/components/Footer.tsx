// Footer.tsx
import React from "react";
import Link from "next/link";

const Footer: React.FC = () => {
  return (
    <footer
      className="w-full bg-[#1A1612]"
      style={{ fontFamily: "'DM Mono', monospace" }}
    >
      <div
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between"
        style={{ padding: "32px 56px" }}
      >
        <span
          className="font-light text-[#F4EFE4] mb-4 sm:mb-0"
          style={{
            fontFamily: "'Fraunces', serif",
            fontSize: "18px",
            letterSpacing: "-0.02em",
          }}
        >
          cogni
          <em className="italic" style={{ color: "#5548B0" }}>
            fy
          </em>
        </span>

        <div className="flex gap-8">
          {[
            { label: "About", href: "/about" },
            { label: "Contact", href: "/contact" },
            { label: "Privacy Policy", href: "/privacy" },
          ].map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-[11px] tracking-[0.12em] uppercase text-[#4A4035] hover:text-[#5548B0] transition-colors border-b border-transparent hover:border-[#5548B0] pb-0.5"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <p className="text-[10px] tracking-[0.12em] uppercase text-[#2a2520] mt-4 sm:mt-0">
          © 2025 Cognify
        </p>
      </div>
    </footer>
  );
};

export default Footer;
