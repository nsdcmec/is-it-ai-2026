import React from "react";
import Navbar from "@/components/Navbar";
import DetailsForm from "@/components/DetailsForm";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#F8FAFC]">
      {/* Navigation */}
      <Navbar />

      {/* Main Registration Content */}
      <main className="flex-1 max-w-xl mx-auto w-full px-4 sm:px-6 py-10 sm:py-16 flex flex-col justify-center">
        {/* Registration Card */}
        <DetailsForm />
      </main>

      {/* Clean Academic Footer */}
      <footer className="w-full bg-white border-t border-slate-200 py-6">
        <div className="max-w-xl mx-auto px-4 sm:px-6 text-center text-xs text-slate-500 space-y-1">
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
