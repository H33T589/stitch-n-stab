"use client";

import { useState } from "react";

const MESSAGES = [
  "Hi Elaine! Hope you're having a great day.",
  "Hi Elaine! Ready to stitch something wonderful today?",
  "Hi Elaine! Good to see you here.",
  "Hi Elaine! Your fancy Persian cats say hi (approve everything).",
  "Hi Elaine! Let’s get your next piece listed for customers.",
  "Hi Elaine! Fun day, right? Time to add a new crochet piece!",
];

export function RotatingElaineGreeting() {
  const [message] = useState(
    () => MESSAGES[Math.floor(Math.random() * MESSAGES.length)]
  );

  return (
    <div className="rounded-2xl border border-white/10 bg-[#0B1020]/70 backdrop-blur px-4 py-3 sm:px-5 sm:py-4 shadow-[0_10px_35px_rgba(0,0,0,0.35)]">
      <p className="text-[0.7rem] sm:text-xs font-semibold tracking-wide text-zinc-400">
        Heet
      </p>
      <p className="font-display text-lg sm:text-xl font-semibold text-white/95 mt-1">
        {message}
      </p>
      <p className="text-xs sm:text-sm text-zinc-400 mt-1">
        If anything feels confusing, tap the red Help button.
      </p>
    </div>
  );
}
