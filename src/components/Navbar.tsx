"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Trophy, BookOpen, Info, ArrowLeft } from "lucide-react";
import AboutModal from "./AboutModal";

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);

  const isHome = pathname === "/";
  const isGame = pathname === "/game";

  const handleRulesClick = (e: React.MouseEvent) => {
    if (isHome) {
      e.preventDefault();
      const el = document.getElementById("rules-section");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-10 h-10 flex items-center justify-center bg-white rounded-lg p-1 border border-slate-200/80 shadow-2xs group-hover:border-slate-300 transition">
                <Image
                  src="/nsdc.png"
                  alt="NSDC MEC"
                  width={36}
                  height={36}
                  className="object-contain"
                  priority
                />
              </div>
              <div className="flex flex-col">
                <span className="font-serif font-bold text-lg leading-tight text-[#0A192F] tracking-tight">
                  NSDC MEC
                </span>
                <span className="text-[10px] uppercase font-semibold text-slate-500 tracking-wider">
                  Visual Challenge
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            {!isGame && (
              <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
                <button
                  type="button"
                  onClick={() => setAboutOpen(true)}
                  className="hover:text-[#0A192F] transition flex items-center gap-1.5 cursor-pointer py-1"
                >
                  <Info className="w-4 h-4 text-slate-400" />
                  About
                </button>
                <Link
                  href={isHome ? "#rules-section" : "/#rules-section"}
                  onClick={handleRulesClick}
                  className="hover:text-[#0A192F] transition flex items-center gap-1.5 py-1"
                >
                  <BookOpen className="w-4 h-4 text-slate-400" />
                  Rules
                </Link>
                <Link
                  href="/leaderboard"
                  className={`hover:text-[#0A192F] transition flex items-center gap-1.5 py-1 ${
                    pathname === "/leaderboard" ? "text-[#0A192F] font-semibold" : ""
                  }`}
                >
                  <Trophy className="w-4 h-4 text-slate-400" />
                  Leaderboard
                </Link>
              </nav>
            )}

            {/* Desktop CTA Button */}
            <div className="hidden md:flex items-center gap-4">
              {isHome ? (
                <Link
                  href="/register"
                  className="px-5 py-2.5 rounded-full text-sm font-semibold bg-[#0A192F] text-white hover:bg-[#152744] active:scale-[0.98] shadow-sm transition flex items-center gap-2 cursor-pointer"
                >
                  Join the Challenge
                </Link>
              ) : (
                <Link
                  href="/"
                  className="px-4 py-2 rounded-full text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Home
                </Link>
              )}
            </div>

            {/* Mobile Hamburger Toggle */}
            <div className="flex md:hidden items-center">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-slate-600 hover:text-[#0A192F] hover:bg-slate-100 focus:outline-none"
                aria-label="Toggle Navigation Menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-3 shadow-lg">
            {!isGame && (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setAboutOpen(true);
                  }}
                  className="w-full text-left px-3 py-2.5 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-3"
                >
                  <Info className="w-5 h-5 text-slate-400" />
                  About
                </button>
                <Link
                  href={isHome ? "#rules-section" : "/#rules-section"}
                  onClick={(e) => {
                    setMobileMenuOpen(false);
                    handleRulesClick(e);
                  }}
                  className="block px-3 py-2.5 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-3"
                >
                  <BookOpen className="w-5 h-5 text-slate-400" />
                  Rules
                </Link>
                <Link
                  href="/leaderboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2.5 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-3"
                >
                  <Trophy className="w-5 h-5 text-slate-400" />
                  Leaderboard
                </Link>
              </>
            )}
            <div className="pt-2">
              {isHome ? (
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center px-4 py-3 rounded-xl text-base font-semibold bg-[#0A192F] text-white hover:bg-[#152744] shadow-sm transition block"
                >
                  Join the Challenge
                </Link>
              ) : (
                <Link
                  href="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center px-4 py-3 rounded-xl text-base font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Home
                </Link>
              )}
            </div>
          </div>
        )}
      </header>

      {/* About Modal */}
      <AboutModal isOpen={aboutOpen} onClose={() => setAboutOpen(false)} />
    </>
  );
}
