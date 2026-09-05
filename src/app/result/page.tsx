"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Trophy, ArrowRight, CheckCircle, Clock, Percent, Award } from "lucide-react";
import ConfettiCelebration from "@/components/ConfettiCelebration";

interface QuizResult {
  score: number;
  correctCount: number;
  averageTime: string;
  accuracy: string;
  name: string;
}

export default function ResultPage() {
  const [result, setResult] = useState<QuizResult>({
    score: 0,
    correctCount: 0,
    averageTime: "0.0s",
    accuracy: "0%",
    name: "Participant",
  });

  useEffect(() => {
    const raw = sessionStorage.getItem("quiz_result");
    if (raw) {
      try {
        setResult(JSON.parse(raw));
      } catch (e) {
        console.error("Failed to parse quiz result", e);
      }
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#F8FAFC] relative overflow-hidden">
      {/* Confetti celebration on completion */}
      <ConfettiCelebration />

      {/* Top Header */}
      <header className="w-full bg-white border-b border-slate-200 px-4 sm:px-6 py-3 flex items-center justify-between z-10">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="relative w-8 h-8 flex items-center justify-center bg-white rounded-lg p-1 border border-slate-200">
            <Image
              src="/nsdc.png"
              alt="NSDC MEC"
              width={28}
              height={28}
              className="object-contain"
              priority
            />
          </div>
          <span className="font-serif font-bold text-sm sm:text-base text-[#0A192F]">
            NSDC MEC
          </span>
        </Link>

        <Link
          href="/leaderboard"
          className="text-xs sm:text-sm font-semibold text-slate-600 hover:text-[#0A192F] transition flex items-center gap-1.5"
        >
          Leaderboard
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </header>

      {/* Main Results Container */}
      <main className="flex-1 max-w-xl mx-auto w-full px-4 py-8 sm:py-12 flex flex-col items-center text-center z-10">
        
        {/* Trophy Icon Medallion */}
        <div className="relative mb-6">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#0A192F] text-white flex items-center justify-center shadow-xl border-4 border-white">
            <Trophy className="w-10 h-10 sm:w-12 sm:h-12 text-amber-400" />
          </div>
          <div className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-emerald-500 text-white shadow-xs">
            <CheckCircle className="w-4 h-4" />
          </div>
        </div>

        {/* Title & Subtitle */}
        <h1 className="font-serif font-extrabold text-3xl sm:text-4xl text-[#0A192F] tracking-tight mb-2">
          Challenge Completed!
        </h1>
        <p className="text-slate-600 text-sm sm:text-base mb-8">
          Here&apos;s how you did, <span className="font-semibold text-slate-900">{result.name}</span>.
        </p>

        {/* 4 Stat Cards in 2x2 Grid */}
        <div className="grid grid-cols-2 gap-4 w-full mb-8">
          {/* Card 1: Score */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs flex flex-col items-center justify-center">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
              <Award className="w-3.5 h-3.5 text-amber-500" />
              Score
            </div>
            <span className="font-serif font-extrabold text-3xl sm:text-4xl text-[#0A192F]">
              {result.score}
            </span>
          </div>

          {/* Card 2: Correct Answers */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs flex flex-col items-center justify-center">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
              Correct Answers
            </div>
            <span className="font-serif font-extrabold text-3xl sm:text-4xl text-[#0A192F]">
              {result.correctCount}
            </span>
          </div>

          {/* Card 3: Average Time */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs flex flex-col items-center justify-center">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
              <Clock className="w-3.5 h-3.5 text-blue-600" />
              Average Time
            </div>
            <span className="font-serif font-extrabold text-3xl sm:text-4xl text-[#0A192F]">
              {result.averageTime}
            </span>
          </div>

          {/* Card 4: Accuracy */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs flex flex-col items-center justify-center">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
              <Percent className="w-3.5 h-3.5 text-indigo-600" />
              Accuracy
            </div>
            <span className="font-serif font-extrabold text-3xl sm:text-4xl text-[#0A192F]">
              {result.accuracy}
            </span>
          </div>
        </div>

        {/* Inspirational Academic Quote */}
        <div className="mb-8">
          <div className="w-12 h-0.5 bg-slate-300 mx-auto mb-3" />
          <p className="font-serif italic text-slate-600 text-sm sm:text-base">
            &ldquo;Curiosity leads to discovery.&rdquo;
          </p>
        </div>

        {/* Primary CTA: View Leaderboard */}
        <Link
          href="/leaderboard"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 py-3.5 px-8 rounded-full bg-[#0A192F] text-white font-semibold text-sm sm:text-base hover:bg-[#152744] active:scale-[0.98] shadow-md transition cursor-pointer"
        >
          View Leaderboard
          <ArrowRight className="w-4 h-4" />
        </Link>
      </main>

      {/* Decorative Wave at Bottom */}
      <div className="relative w-full h-24 sm:h-32 pointer-events-none">
        <svg
          viewBox="0 0 1440 320"
          className="absolute bottom-0 w-full h-full text-[#0A192F]/10 fill-current"
          preserveAspectRatio="none"
        >
          <path d="M0,192L48,197.3C96,203,192,213,288,208C384,203,480,181,576,181.3C672,181,768,203,864,208C960,213,1056,203,1152,181.3C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" />
        </svg>
        <svg
          viewBox="0 0 1440 320"
          className="absolute bottom-0 w-full h-20 text-[#0A192F]/15 fill-current"
          preserveAspectRatio="none"
        >
          <path d="M0,224L60,213.3C120,203,240,181,360,186.7C480,192,600,224,720,224C840,224,960,192,1080,186.7C1200,181,1320,203,1380,213.3L1440,224L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z" />
        </svg>
      </div>
    </div>
  );
}
