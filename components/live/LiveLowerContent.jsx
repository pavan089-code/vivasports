"use client";

import { memo, useEffect, useMemo, useRef } from "react";

import BatterCard from "@/components/match/BatterCard";
import { calculateOvers } from "@/utils/matchUtils";

function LiveLowerContent({ match, commentary }) {
  const commentaryRef = useRef(null);
  const bowlerOvers = useMemo(
    () => calculateOvers(match.currentBowler?.balls || 0),
    [match.currentBowler?.balls]
  );

  useEffect(() => {
    if (!commentaryRef.current) return;

    commentaryRef.current.scrollTo({
      top: commentaryRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [commentary.length]);

  return (
    <>
      <div className="grid gap-4 lg:grid-cols-3">
        <BatterCard batter={match.striker} isStriker={true} />

        <BatterCard batter={match.nonStriker} isStriker={false} />

        <div className="vs-card p-5">
          <p className="text-slate-300">Current Bowler</p>
          <h3 className="mt-2 text-2xl font-black">
            {match.currentBowler?.name || "Select Bowler"}
          </h3>
          <div className="mt-4 flex gap-6 text-slate-300">
            <p>O: {bowlerOvers}</p>
            <p>R: {match.currentBowler?.runs || 0}</p>
            <p>W: {match.currentBowler?.wickets || 0}</p>
          </div>
        </div>
      </div>

      <div className="vs-card rounded-2xl p-5">
        <h2 className="mb-3 text-2xl font-black">Ball-by-ball Commentary</h2>
        <div
          ref={commentaryRef}
          className="max-h-72 space-y-3 overflow-y-auto pr-2 scroll-smooth"
        >
          {commentary.map((ball, index) => (
            <p key={`${ball.createdAt}-${index}`} className="text-slate-300">
              {ball.commentary}
            </p>
          ))}
          {!commentary.length && (
            <p className="text-slate-300">No deliveries recorded yet.</p>
          )}
        </div>
      </div>

      <MatchNotes notes={match.matchNotes} />
    </>
  );
}

function MatchNotes({ notes = [] }) {
  if (!notes.length) return null;

  return (
    <div className="vs-card mt-6 rounded-3xl p-6 text-left">
      <h2 className="text-2xl font-black">Match Notes</h2>
      <div className="mt-4 space-y-3">
        {notes.slice(-5).reverse().map((note) => (
          <p key={note.createdAt} className="text-slate-300">
            <span className="font-bold text-[var(--vs-gold-soft)]">
              {note.role || "official"}:
            </span>{" "}
            {note.text}
          </p>
        ))}
      </div>
    </div>
  );
}

export default memo(LiveLowerContent);
