"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import clsx from "clsx";
import { Clock, Sparkles, Leaf, Info, AlertCircle, RefreshCw } from "lucide-react";
import { formatTime } from "@/lib/utils";
import { optimizeImageUrl } from "@/lib/imageOptimization";
import { generateControlledQuizSequence } from "@/lib/quizRandomizer";

interface Picture {
  id: number;
  src: string;
  ai: boolean;
  isVideo: boolean;
}

export default function GamePage() {
  const router = useRouter();

  // Participant state
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [token, setToken] = useState<string>("");

  // Game data state
  const [pictures, setPictures] = useState<Picture[]>([]);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [totalTimeTaken, setTotalTimeTaken] = useState(0);

  // Timing state - timer starts ONLY when image is presented to the user
  const [questionStartTime, setQuestionStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);

  // UI state
  const [isMediaLoading, setIsMediaLoading] = useState(true);
  const [mediaError, setMediaError] = useState(false);
  const [isAnswerLocked, setIsAnswerLocked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<"idle" | "correct" | "incorrect">("idle");

  // Cache & media references to ensure zero garbage collection and instant cache detection
  const mediaImgRef = useRef<HTMLImageElement | null>(null);
  const preloadedMapRef = useRef<Map<string, HTMLImageElement>>(new Map());

  // Image URL optimization
  const addTransform = (src: string, isVideo: boolean = false) => {
    return optimizeImageUrl(src, isVideo);
  };

  // 1. Initial participant verification
  useEffect(() => {
    const savedName = localStorage.getItem("participant_name");
    const savedEmail = localStorage.getItem("participant_email");
    const savedToken = localStorage.getItem("quiz_token");
    const isCompleted = localStorage.getItem("quiz_completed");

    if (isCompleted === "true") {
      router.replace("/leaderboard");
      return;
    }

    if (!savedName || !savedEmail || !savedToken) {
      router.replace("/");
      return;
    }

    setName(savedName);
    setEmail(savedEmail);
    setToken(savedToken);
  }, [router]);

  // 2. Fetch questions from pre-warmed cache or API
  useEffect(() => {
    // Check if pre-warmed questions are already in sessionStorage from registration page
    const cached = sessionStorage.getItem("quiz_pictures_cache");
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setPictures(parsed);
          return;
        }
      } catch (e) {
        console.warn("Invalid cached pictures, fetching fresh:", e);
      }
    }

    const fetchPictures = async () => {
      try {
        const res = await fetch("/api/pictures");
        if (!res.ok) throw new Error("Failed to load pictures");
        const data = await res.json();
        
        const transformed: Picture[] = data.map((pic: Picture) => ({
          ...pic,
          src: addTransform(pic.src, pic.isVideo),
        }));

        // Controlled randomization: guarantees streaks <= 3 and avoids predictable alternation
        const randomized = generateControlledQuizSequence(transformed, 3);
        setPictures(randomized);
      } catch (err) {
        console.error("Error fetching pictures:", err);
      }
    };

    fetchPictures();
  }, []);

  // 3. Media readiness handler - strictly starts the answering timer only when media is ready
  const handleMediaReady = useCallback(() => {
    setIsMediaLoading(false);
    setMediaError(false);
    setQuestionStartTime((prev) => (prev === null ? Date.now() : prev));
  }, []);

  // 4. Question setup when index changes
  useEffect(() => {
    if (pictures.length > 0 && current < pictures.length) {
      setIsMediaLoading(true);
      setMediaError(false);
      setIsAnswerLocked(false);
      setFeedback("idle");
      setElapsedTime(0);
      setQuestionStartTime(null);

      // Check if image is already cached in memory
      const currentPic = pictures[current];
      if (!currentPic.isVideo && typeof window !== "undefined") {
        const preloaded = preloadedMapRef.current.get(currentPic.src);
        if (preloaded && preloaded.complete && preloaded.naturalWidth > 0) {
          handleMediaReady();
        }
      }
    }
  }, [current, pictures, handleMediaReady]);

  // 5. Active question timer - runs ONLY after media is loaded and ready
  useEffect(() => {
    if (!isMediaLoading && questionStartTime !== null && current < pictures.length) {
      const interval = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - questionStartTime) / 1000));
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isMediaLoading, questionStartTime, current, pictures.length]);

  // 6. Preload NEXT question's image in the background while participant answers current question
  useEffect(() => {
    if (!isMediaLoading && pictures.length > 0 && current + 1 < pictures.length) {
      const nextPic = pictures[current + 1];
      if (!nextPic.isVideo && typeof window !== "undefined") {
        if (!preloadedMapRef.current.has(nextPic.src)) {
          const img = new window.Image();
          if ("fetchPriority" in img) {
            (img as any).fetchPriority = "low";
          }
          img.src = nextPic.src;
          preloadedMapRef.current.set(nextPic.src, img);
        }
      }
    }
  }, [isMediaLoading, current, pictures]);

  // 7. Submit final score to API
  const submitFinalScore = async (
    finalScore: number,
    finalCorrect: number,
    finalTotalTime: number,
    totalQuestions: number
  ) => {
    setIsSubmitting(true);
    try {
      await fetch("/api/score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          score: finalScore,
          email,
          token,
        }),
      });

      // Clear quiz questions cache
      sessionStorage.removeItem("quiz_pictures_cache");

      // Save summary metrics for the result screen
      const avgTime = (finalTotalTime / Math.max(totalQuestions, 1)).toFixed(1);
      const accuracy = Math.round((finalCorrect / Math.max(totalQuestions, 1)) * 100);

      const summary = {
        score: finalScore,
        correctCount: finalCorrect,
        averageTime: `${avgTime}s`,
        accuracy: `${accuracy}%`,
        name,
      };

      sessionStorage.setItem("quiz_result", JSON.stringify(summary));
      localStorage.setItem("quiz_completed", "true");

      router.replace("/result");
    } catch (err) {
      console.error("Failed to submit score:", err);
      router.replace("/result");
    }
  };

  // 8. Handle user classification (Real = false, AI = true) with immediate lock and visual feedback
  const handleGuess = useCallback(
    (guess: boolean) => {
      if (isAnswerLocked || isMediaLoading || !questionStartTime || pictures.length === 0) return;

      // Immediately disable buttons to prevent duplicate clicks or answer alteration
      setIsAnswerLocked(true);

      const timeTaken = Math.max(0, Math.floor((Date.now() - questionStartTime) / 1000));
      const isCorrect = pictures[current].ai === guess;

      // Freeze timer during feedback display
      setQuestionStartTime(null);

      // Trigger subtle card outline feedback (green for correct, red for incorrect)
      setFeedback(isCorrect ? "correct" : "incorrect");

      const pointsEarned = isCorrect ? Math.max(50 - timeTaken, 1) : 0;
      const newScore = score + pointsEarned;
      const newCorrect = isCorrect ? correctCount + 1 : correctCount;
      const newTotalTime = totalTimeTaken + timeTaken;

      setScore(newScore);
      setCorrectCount(newCorrect);
      setTotalTimeTaken(newTotalTime);

      // Brief delay so participant clearly perceives the feedback, then proceed
      setTimeout(() => {
        setFeedback("idle");
        if (current + 1 < pictures.length) {
          setCurrent((prev) => prev + 1);
        } else {
          submitFinalScore(newScore, newCorrect, newTotalTime, pictures.length);
        }
      }, 750);
    },
    [isAnswerLocked, isMediaLoading, questionStartTime, pictures, current, score, correctCount, totalTimeTaken]
  );

  // 9. Keyboard shortcuts (Press '1' for Real, '2' for AI)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isAnswerLocked || isMediaLoading || pictures.length === 0 || current >= pictures.length) return;

      if (e.key === "1") {
        handleGuess(false); // Real
      } else if (e.key === "2") {
        handleGuess(true); // AI
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleGuess, isAnswerLocked, isMediaLoading, pictures.length, current]);

  // Loading screen before pictures load
  if (pictures.length === 0) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 border-3 border-[#0A192F]/20 border-t-[#0A192F] rounded-full animate-spin mb-4" />
        <p className="text-slate-600 text-sm font-medium">Preparing challenge...</p>
      </div>
    );
  }

  // Submission overlay when quiz finishes
  if (isSubmitting || current >= pictures.length) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 border-3 border-[#0A192F]/20 border-t-[#0A192F] rounded-full animate-spin mb-4" />
        <h2 className="font-serif font-bold text-2xl text-[#0A192F] mb-2">Calculating Your Results</h2>
        <p className="text-slate-500 text-sm">Recording your official score on the leaderboard...</p>
      </div>
    );
  }

  const currentPicture = pictures[current];
  const progressPercent = Math.min(Math.round(((current + 1) / pictures.length) * 100), 100);

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      {/* Top Header */}
      <header className="w-full bg-white border-b border-slate-200 px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
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
        </div>

        {/* Live Timer Pill */}
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-slate-800 font-mono text-xs sm:text-sm font-semibold shadow-2xs">
          <Clock className="w-4 h-4 text-slate-500" />
          <span>{formatTime(elapsedTime)}</span>
        </div>
      </header>

      {/* Main Game Stage */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-4 sm:py-6 flex flex-col justify-between">
        
        {/* Top Progress Bar (No total question count displayed) */}
        <div className="w-full mb-4">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-1.5">
            <span>Question</span>
          </div>
          <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#0A192F] rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Center Media Card with Answer Feedback Outline */}
        <div
          className={clsx(
            "relative w-full h-[46vh] sm:h-[52vh] max-h-[500px] bg-slate-100 rounded-2xl overflow-hidden flex items-center justify-center p-3 sm:p-4 transition-all duration-200 shadow-xs",
            feedback === "idle" && "border border-slate-200/90",
            feedback === "correct" && "border-2 border-emerald-500 ring-4 ring-emerald-500/20 shadow-emerald-500/10",
            feedback === "incorrect" && "border-2 border-rose-500 ring-4 ring-rose-500/20 shadow-rose-500/10"
          )}
        >
          
          {/* Loading Skeleton */}
          {isMediaLoading && (
            <div className="absolute inset-0 skeleton-shimmer flex items-center justify-center z-10">
              <div className="w-8 h-8 border-2 border-slate-400/40 border-t-slate-700 rounded-full animate-spin" />
            </div>
          )}

          {/* Media Error State */}
          {mediaError ? (
            <div className="flex flex-col items-center justify-center text-center p-6 text-slate-500">
              <AlertCircle className="w-10 h-10 text-red-400 mb-2" />
              <p className="text-sm font-medium mb-3">Unable to load image.</p>
              <button
                type="button"
                onClick={() => {
                  setMediaError(false);
                  setIsMediaLoading(true);
                }}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0A192F] hover:underline cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Retry
              </button>
            </div>
          ) : currentPicture.isVideo ? (
            <video
              key={currentPicture.src}
              src={`${currentPicture.src}#t=0.1`}
              controls
              playsInline
              preload="metadata"
              onLoadedData={handleMediaReady}
              onCanPlay={handleMediaReady}
              onError={() => {
                setIsMediaLoading(false);
                setMediaError(true);
              }}
              className="w-full h-full object-contain rounded-xl"
            />
          ) : (
            <img
              ref={(el) => {
                mediaImgRef.current = el;
                if (el && el.complete && el.naturalWidth > 0 && isMediaLoading) {
                  handleMediaReady();
                }
              }}
              key={currentPicture.src}
              src={currentPicture.src}
              alt="Visual Challenge Subject"
              loading="eager"
              decoding="async"
              fetchPriority="high"
              onLoad={handleMediaReady}
              onError={() => {
                setIsMediaLoading(false);
                setMediaError(true);
              }}
              className="max-w-full max-h-full object-contain rounded-xl"
            />
          )}
        </div>

        {/* Question Prompt */}
        <div className="text-center my-4 sm:my-5">
          <h2 className="font-serif font-bold text-xl sm:text-2xl text-[#0A192F]">
            Is this image AI-generated?
          </h2>
        </div>

        {/* Big Action Buttons */}
        <div className="grid grid-cols-2 gap-4 sm:gap-6 mb-4">
          {/* REAL Button */}
          <button
            type="button"
            disabled={isAnswerLocked || isMediaLoading}
            onClick={() => handleGuess(false)}
            className="group relative flex flex-col items-center justify-center py-4 sm:py-5 px-4 rounded-2xl bg-white border-2 border-[#0A192F] text-[#0A192F] hover:bg-slate-50 active:scale-[0.98] transition shadow-xs disabled:opacity-50 cursor-pointer"
          >
            <div className="flex items-center gap-2 mb-1">
              <Leaf className="w-5 h-5 text-emerald-700" />
              <span className="font-serif font-bold text-lg sm:text-xl">Real</span>
            </div>
            <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
              Press 1
            </span>
          </button>

          {/* AI Button */}
          <button
            type="button"
            disabled={isAnswerLocked || isMediaLoading}
            onClick={() => handleGuess(true)}
            className="group relative flex flex-col items-center justify-center py-4 sm:py-5 px-4 rounded-2xl bg-[#0A192F] text-white hover:bg-[#152744] active:scale-[0.98] transition shadow-xs disabled:opacity-50 cursor-pointer"
          >
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-5 h-5 text-sky-300" />
              <span className="font-serif font-bold text-lg sm:text-xl">AI</span>
            </div>
            <span className="text-[11px] font-semibold text-slate-300 bg-white/10 px-2 py-0.5 rounded-md">
              Press 2
            </span>
          </button>
        </div>

        {/* Helper Tip */}
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-center gap-2 text-xs text-slate-500">
          <Info className="w-4 h-4 text-slate-400 shrink-0" />
          <span>Trust your intuition, but look for the details.</span>
        </div>
      </main>
    </div>
  );
}
