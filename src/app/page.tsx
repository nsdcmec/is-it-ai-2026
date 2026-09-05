import React from "react";
import Navbar from "@/components/Navbar";
import RulesCard from "@/components/RulesCard";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#F8FAFC]">
      {/* Navigation */}
      <Navbar />

      {/* Main Centered Content Area */}
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 sm:py-16 flex flex-col items-center text-center space-y-10">
        
        {/* Centered Hero Header */}
        <div className="space-y-3.5 max-w-2xl">
          <span className="inline-block text-xs uppercase font-bold tracking-widest text-slate-500">
            NSDC MEC PRESENTS
          </span>
          <h1 className="font-serif font-extrabold text-4xl sm:text-5xl lg:text-6xl text-[#0A192F] tracking-tight">
            Is It AI?
          </h1>
          <p className="text-lg sm:text-xl font-semibold text-slate-700">
            A visual challenge by NSDC MEC
          </p>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Look closely. Think critically. Can you tell what&apos;s real and what&apos;s AI-generated?
          </p>
        </div>

        {/* Centered Rules and Instructions Card with Proceed Button */}
        <div className="w-full">
          <RulesCard />
        </div>
      </main>

      {/* Clean Academic Footer */}
      <footer className="w-full bg-white border-t border-slate-200 py-6 mt-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center text-xs text-slate-500 space-y-1">
          <div className="flex items-center justify-center gap-2">
            <span className="font-semibold text-[#0A192F]">NSDC MEC</span>
            <span>&bull;</span>
            <span>Is It AI?</span>
            <span>&bull;</span>
            <span>A visual challenge</span>
          </div>
          <p>Model Engineering College</p>
        </div>
      </footer>
    </div>
  );
}
