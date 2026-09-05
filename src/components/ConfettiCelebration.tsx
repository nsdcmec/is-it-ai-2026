"use client";

import { useEffect } from "react";
import confetti from "canvas-confetti";

export default function ConfettiCelebration() {
  useEffect(() => {
    const end = Date.now() + 3 * 1000;
    // Elegant Oxford Blue, gold, silver, and azure colors
    const colors = ["#0A192F", "#1E3A8A", "#F59E0B", "#38BDF8", "#E2E8F0"];

    const frame = () => {
      if (Date.now() > end) return;

      confetti({
        particleCount: 3,
        angle: 60,
        spread: 60,
        startVelocity: 55,
        origin: { x: 0, y: 0.6 },
        colors: colors,
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 60,
        startVelocity: 55,
        origin: { x: 1, y: 0.6 },
        colors: colors,
      });

      requestAnimationFrame(frame);
    };

    frame();
  }, []);

  return null;
}
