"use client";

import { useState } from "react";
import { Play } from "lucide-react";

import Card from "../ui/Card";
import { getMatchYouTubeUrl, getYouTubeVideoId } from "@/utils/youtubeUtils";

export default function LiveStream({ match }) {
  const embedUrl = getMatchYouTubeUrl(match);
  const videoId = getYouTubeVideoId(embedUrl);
  const thumbnailUrl = videoId
    ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
    : "";
  const [loaded, setLoaded] = useState(false);

  return (
    <Card className="overflow-hidden p-0" id="live-stream-section">
      <div className="aspect-video bg-black">
        {embedUrl && loaded ? (
          <iframe
            title={`${match?.teamA || "Viva Sports"} live stream`}
            className="h-full w-full"
            src={`${embedUrl}?autoplay=1&rel=0`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        ) : embedUrl ? (
          <button
            type="button"
            onClick={() => setLoaded(true)}
            className="group relative flex h-full w-full items-center justify-center overflow-hidden bg-[var(--surface)]"
            aria-label="Play live stream"
          >
            {thumbnailUrl && (
              <span
                className="absolute inset-0 bg-cover bg-center opacity-75 transition group-hover:scale-105"
                style={{ backgroundImage: `url(${thumbnailUrl})` }}
                aria-hidden="true"
              />
            )}
            <span className="absolute inset-0 bg-black/35" />
            <span className="relative flex h-16 w-16 items-center justify-center rounded-full bg-[#D4AF37] text-[#06152F] shadow-2xl shadow-black/40">
              <Play className="h-8 w-8 fill-current" />
            </span>
            <span className="absolute bottom-4 left-4 rounded-full bg-black/70 px-3 py-1 text-xs font-black uppercase tracking-wider text-white">
              Watch Stream
            </span>
          </button>
        ) : (
          <div className="flex h-full items-center justify-center bg-[var(--surface)] px-4 text-center">
            <p className="text-lg font-black text-[var(--text-secondary)]">
              Live stream not available
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}
