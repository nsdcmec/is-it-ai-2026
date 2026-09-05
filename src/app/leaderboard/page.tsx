"use client";

import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import ConfettiCelebration from "@/components/ConfettiCelebration";
import { Trophy, Medal, Search, UserCheck } from "lucide-react";

interface PlayerScore {
  id: number;
  name: string;
  email?: string;
  score: number;
  createdAt?: string;
}

export default function LeaderboardPage() {
  const [scores, setScores] = useState<PlayerScore[]>([]);
  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null);
  const [currentUserName, setCurrentUserName] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentUserEmail(localStorage.getItem("participant_email"));
      setCurrentUserName(localStorage.getItem("participant_name"));
    }

    const fetchLeaderboard = async () => {
      try {
        const res = await fetch("/api/scoreboard");
        if (!res.ok) throw new Error("Failed to fetch scoreboard");
        const data = await res.json();
        setScores(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error loading scoreboard:", err);
        setScores([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  const filteredScores = scores.filter((player) =>
    player.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <ConfettiCelebration />
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Title & Subtitle */}
        <div className="text-center mb-8 sm:mb-10">
          <div className="inline-flex p-3 rounded-2xl bg-amber-50 border border-amber-100 text-amber-600 mb-3">
            <Trophy className="w-8 h-8" />
          </div>
          <h1 className="font-serif font-extrabold text-3xl sm:text-4xl text-[#0A192F] tracking-tight mb-2">
            Leaderboard
          </h1>
          <p className="text-slate-600 text-sm sm:text-base font-medium">
            Top minds. Sharp eyes. Real or AI?
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="mb-6 flex items-center justify-between gap-4">
          <div className="relative w-full max-w-xs">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search participant..."
              className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-900 text-xs sm:text-sm focus:border-[#0A192F] focus:ring-1 focus:ring-[#0A192F] transition outline-hidden shadow-2xs"
            />
          </div>

          <div className="text-xs font-semibold text-slate-500">
            {scores.length} {scores.length === 1 ? "Participant Ranked" : "Participants Ranked"}
          </div>
        </div>

        {/* Leaderboard Table Container */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
          {isLoading ? (
            <div className="p-12 text-center">
              <div className="w-8 h-8 border-2 border-[#0A192F]/30 border-t-[#0A192F] rounded-full animate-spin mx-auto mb-3" />
              <p className="text-xs text-slate-500 font-medium">Loading rankings...</p>
            </div>
          ) : scores.length === 0 ? (
            <div className="p-12 text-center text-slate-500">
              <Trophy className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-medium">No scores yet.</p>
            </div>
          ) : filteredScores.length === 0 ? (
            <div className="p-12 text-center text-slate-500">
              <Search className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-medium">No participants found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/90 border-b border-slate-200 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-600">
                    <th className="py-3.5 px-4 sm:px-6 w-16 text-center">#</th>
                    <th className="py-3.5 px-4 sm:px-6">Participant</th>
                    <th className="py-3.5 px-4 sm:px-6 text-right">Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {filteredScores.map((player, index) => {
                    const isCurrentUser =
                      (currentUserEmail && player.email === currentUserEmail) ||
                      (currentUserName && player.name === currentUserName);

                    const rank = index + 1;

                    return (
                      <tr
                        key={player.id}
                        className={`transition hover:bg-slate-50/80 ${
                          isCurrentUser
                            ? "bg-blue-50/80 font-semibold text-[#0A192F]"
                            : index % 2 === 0
                            ? "bg-white"
                            : "bg-slate-50/30"
                        }`}
                      >
                        {/* Rank */}
                        <td className="py-4 px-4 sm:px-6 text-center font-mono">
                          {rank === 1 ? (
                            <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-amber-100 text-amber-700 font-bold text-xs shadow-2xs">
                              1
                            </span>
                          ) : rank === 2 ? (
                            <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-slate-200 text-slate-700 font-bold text-xs shadow-2xs">
                              2
                            </span>
                          ) : rank === 3 ? (
                            <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-amber-700/10 text-amber-800 font-bold text-xs shadow-2xs">
                              3
                            </span>
                          ) : (
                            <span className="text-slate-500 font-medium text-xs">
                              {rank}
                            </span>
                          )}
                        </td>

                        {/* Name */}
                        <td className="py-4 px-4 sm:px-6">
                          <div className="flex items-center gap-2">
                            <span className="text-slate-900 font-medium">
                              {player.name}
                            </span>
                            {isCurrentUser && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-[#0A192F] text-white px-2 py-0.5 rounded-full">
                                <UserCheck className="w-3 h-3" />
                                You
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Score */}
                        <td className="py-4 px-4 sm:px-6 text-right font-mono font-bold text-base text-[#0A192F]">
                          {player.score.toLocaleString()}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-white border-t border-slate-200 py-6 mt-12 text-center text-xs text-slate-500">
        NSDC MEC &bull; Model Engineering College
      </footer>
    </div>
  );
}
