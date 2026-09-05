"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User, Mail, ArrowRight, CheckCircle2, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { generateControlledQuizSequence } from "@/lib/quizRandomizer";

export default function DetailsForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [alreadyCompleted, setAlreadyCompleted] = useState(false);

  useEffect(() => {
    // Check if participant has already finished an attempt
    const completed = localStorage.getItem("quiz_completed");
    if (completed === "true") {
      setAlreadyCompleted(true);
      return;
    }

    // Pre-warm /api/pictures and preload Question 1 image while participant enters details
    const prewarmQuiz = async () => {
      try {
        const res = await fetch("/api/pictures");
        if (!res.ok) return;
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          const randomized = generateControlledQuizSequence(data, 3);
          sessionStorage.setItem("quiz_pictures_cache", JSON.stringify(randomized));

          // Preload Question 1 image only
          const first = randomized[0];
          if (first && !first.isVideo && typeof window !== "undefined") {
            const img = new window.Image();
            if ("fetchPriority" in img) {
              (img as any).fetchPriority = "high";
            }
            img.src = first.src;
          }
        }
      } catch (e) {
        // Silently ignore; /game will fetch directly if needed
      }
    };

    prewarmQuiz();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();

    if (trimmedName.length < 3) {
      setError("Please enter your full name (minimum 3 characters).");
      return;
    }

    if (!trimmedEmail.includes("@") || !trimmedEmail.includes(".") || trimmedEmail.length < 5) {
      setError("Please enter a valid email address.");
      return;
    }

    setIsLoading(true);

    try {
      // Generate security token for attempt verification
      const token = typeof crypto !== "undefined" && crypto.randomUUID 
        ? crypto.randomUUID() 
        : `token_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

      localStorage.setItem("quiz_token", token);
      localStorage.setItem("participant_name", trimmedName);
      localStorage.setItem("participant_email", trimmedEmail);

      // Set cookie for API route verification
      document.cookie = `quiz_token=${token}; path=/; max-age=86400; SameSite=Lax`;

      // Navigate to game
      router.push("/game");
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  if (alreadyCompleted) {
    return (
      <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-xs">
        <div className="flex items-center gap-2.5 mb-4 text-[#0A192F]">
          <CheckCircle2 className="w-6 h-6 text-emerald-600" />
          <h3 className="font-serif font-bold text-xl">Attempt Recorded</h3>
        </div>
        <p className="text-slate-600 text-sm mb-6 leading-relaxed">
          You have already completed your official entry for this competition. Per competition rules, only one attempt is permitted per participant.
        </p>
        <Link
          href="/leaderboard"
          className="w-full inline-flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-[#0A192F] text-white font-semibold hover:bg-[#152744] transition shadow-xs"
        >
          View Live Leaderboard
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div id="registration-section" className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-xs">
      <div className="mb-5">
        <h3 className="font-serif font-bold text-xl text-[#0A192F] mb-1">
          Enter Your Details
        </h3>
        <p className="text-xs text-slate-500">
          Provide your official details to begin the challenge and register your score.
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Name Field */}
          <div>
            <label htmlFor="participant-name" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Your Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <User className="w-4 h-4" />
              </div>
              <input
                id="participant-name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Jane Doe"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:bg-white focus:border-[#0A192F] focus:ring-1 focus:ring-[#0A192F] transition outline-hidden"
              />
            </div>
          </div>

          {/* Email Field */}
          <div>
            <label htmlFor="participant-email" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Your Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                id="participant-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. jane@example.com"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:bg-white focus:border-[#0A192F] focus:ring-1 focus:ring-[#0A192F] transition outline-hidden"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full mt-2 py-3.5 px-6 rounded-xl bg-[#0A192F] hover:bg-[#152744] active:scale-[0.99] text-white font-semibold text-sm sm:text-base flex items-center justify-center gap-2 shadow-xs transition cursor-pointer disabled:opacity-50"
        >
          {isLoading ? (
            <span className="inline-flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Initializing Challenge...
            </span>
          ) : (
            <>
              Start the Challenge
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>

        <p className="text-[11px] text-center text-slate-500 pt-1">
          By participating, you agree to the competition rules.
        </p>
      </form>
    </div>
  );
}
