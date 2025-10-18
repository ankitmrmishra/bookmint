"use client";

import React, { useEffect } from "react";
import { cn } from "@/lib/utils";

type Props = {
  eventId: number;
  baseLikes?: number;
  className?: string;
};

export function LikeButton({ eventId, baseLikes = 0, className }: Props) {
  const storageKey = `likes:${eventId}`;
  const [liked, setLiked] = React.useState(false);
  const [count, setCount] = React.useState(baseLikes);

  useEffect(() => {
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      const parsed = JSON.parse(stored) as { liked: boolean; count: number };
      setLiked(parsed.liked);
      setCount(parsed.count);
    }
  }, [eventId]);

  const toggle = () => {
    setLiked((prev) => {
      const next = !prev;
      setCount((c) => {
        const updated = next ? c + 1 : Math.max(0, c - 1);
        localStorage.setItem(
          storageKey,
          JSON.stringify({ liked: next, count: updated })
        );
        return updated;
      });
      return next;
    });
  };

  return (
    <button
      onClick={toggle}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-secondary",
        className
      )}
      aria-pressed={liked}
      aria-label={liked ? "Unlike" : "Like"}
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        className={liked ? "text-like-red" : "text-muted-foreground"}
        aria-hidden="true"
      >
        <path
          fill="currentColor"
          d="M12.1 21.35 10 19.28C5.4 14.91 2 11.77 2 8.5 2 6 4 4 6.5 4c1.74 0 3.41 1.01 4.1 2.44C11.09 5.01 12.76 4 14.5 4 17 4 19 6 19 8.5c0 3.27-3.4 6.41-8 10.78l-1.1 1.07z"
        />
      </svg>
      <span className="tabular-nums">{count}</span>
    </button>
  );
}
