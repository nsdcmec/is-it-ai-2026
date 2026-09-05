import React from "react";
import Link from "next/link";
import { AlertCircle, Clock, ShieldAlert, Wifi, ArrowRight } from "lucide-react";

export default function RulesCard() {
  return (
    <div id="rules-section" className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/90 shadow-sm text-left">
      <div className="flex items-center gap-2.5 mb-6 pb-4 border-b border-slate-100">
        <span className="text-xl">📝</span>
        <h2 className="font-serif font-bold text-xl sm:text-2xl text-[#0A192F]">
          Rules & Instructions
        </h2>
      </div>

      <ul className="space-y-5 text-slate-700 text-sm sm:text-base leading-relaxed">
        {/* Rule 1 */}
        <li className="flex items-start gap-3.5">
          <div className="mt-1 p-1 rounded-full bg-red-50 text-red-600 shrink-0">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div>
            <strong>Only one entry</strong> is allowed per participant. Duplicate entries will be{" "}
            <span className="text-red-600 font-semibold underline decoration-red-200 underline-offset-2">
              disqualified
            </span>.
          </div>
        </li>

        {/* Rule 2 */}
        <li className="flex items-start gap-3.5">
          <div className="mt-1 p-1 rounded-full bg-blue-50 text-[#0A192F] shrink-0">
            <AlertCircle className="w-4 h-4" />
          </div>
          <div>
            Please enter your <strong>name and email carefully</strong>. These will be used to contact the winner.
          </div>
        </li>

        {/* Rule 3 */}
        <li className="flex items-start gap-3.5">
          <div className="mt-1 p-1 rounded-full bg-emerald-50 text-emerald-700 shrink-0">
            <Clock className="w-4 h-4" />
          </div>
          <div className="space-y-1">
            <div>
              <strong>Scoring is time-based:</strong>
            </div>
            <div className="pl-1 text-slate-600 text-xs sm:text-sm">
              You get <span className="text-emerald-600 font-semibold">50 points</span> if you answer correct in 0 seconds.
              <br />
              For every additional second, <span className="text-red-500 font-semibold">1 point is deducted</span>.
              <br />
              <span className="italic text-slate-500">
                Example: Answering correct in 3 seconds = <span className="font-semibold text-slate-700">47 points</span>
              </span>
            </div>
          </div>
        </li>

        {/* Rule 4 */}
        <li className="flex items-start gap-3.5">
          <div className="mt-1 p-1 rounded-full bg-amber-50 text-amber-700 shrink-0">
            <Wifi className="w-4 h-4" />
          </div>
          <div>
            Ensure a <strong>strong internet connection</strong> to avoid delays in loading content — because{" "}
            <span className="text-red-600 font-semibold underline decoration-red-200 underline-offset-2">
              every second matters
            </span>!
          </div>
        </li>
      </ul>

      {/* Prominent Proceed Button */}
      <div className="mt-8 pt-6 border-t border-slate-100 flex justify-center">
        <Link
          href="/register"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 py-3.5 px-8 rounded-xl bg-[#0A192F] text-white font-semibold text-base hover:bg-[#152744] active:scale-[0.99] shadow-sm transition cursor-pointer"
        >
          Proceed
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    </div>
  );
}
