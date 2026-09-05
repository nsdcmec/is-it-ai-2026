"use client";

import React from "react";
import Image from "next/image";
import { X, Award, Eye, ShieldCheck, Zap } from "lucide-react";

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AboutModal({ isOpen, onClose }: AboutModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 md:p-8 overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="about-title"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-xl bg-[#0A192F]/5 p-2 border border-slate-200 flex items-center justify-center">
            <Image
              src="/nsdc.png"
              alt="NSDC MEC"
              width={32}
              height={32}
              className="object-contain"
            />
          </div>
          <div>
            <h3 id="about-title" className="font-serif font-bold text-xl text-[#0A192F]">
              About the Challenge
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Presented by NSDC MEC
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4 text-sm text-slate-600 leading-relaxed">
          <p>
            <strong className="text-[#0A192F]">Is It AI?</strong> is a visual discrimination challenge designed by 
            NSDC MEC to test your perceptual awareness in an era of rapidly evolving generative models.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-2.5">
              <Eye className="w-5 h-5 text-[#0A192F] shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-xs text-[#0A192F] block">Look for Artifacts</span>
                <span className="text-xs text-slate-500">Notice edge bleed, hair strands, reflections, and unnatural symmetries.</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-2.5">
              <Zap className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-xs text-[#0A192F] block">Speed & Precision</span>
                <span className="text-xs text-slate-500">50 points awarded per question, diminishing with elapsed time.</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-2.5">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-xs text-[#0A192F] block">Fair Competition</span>
                <span className="text-xs text-slate-500">One official attempt per participant to maintain ranking integrity.</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-2.5">
              <Award className="w-5 h-5 text-[#1E3A8A] shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-xs text-[#0A192F] block">Live Leaderboard</span>
                <span className="text-xs text-slate-500">Track how your accuracy and speed compare to peers across the campus.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-sm font-semibold rounded-lg bg-[#0A192F] text-white hover:bg-[#152744] transition"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}
