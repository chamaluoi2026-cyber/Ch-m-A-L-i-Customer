"use client";

import { useMemo, useState } from "react";
import { Play, Film, ExternalLink } from "lucide-react";

interface BlogVideoEmbedProps {
  url: string;
  caption?: string;
  aspectRatio?: "16/9" | "9/16";
  className?: string;
}

export function parseYouTubeVideoId(url: string): string | null {
  if (!url) return null;
  const cleanUrl = url.trim();

  // Pattern 1: youtu.be/<id>
  const shortMatch = cleanUrl.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
  if (shortMatch) return shortMatch[1];

  // Pattern 2: youtube.com/watch?v=<id>
  const watchMatch = cleanUrl.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
  if (watchMatch) return watchMatch[1];

  // Pattern 3: youtube.com/embed/<id>
  const embedMatch = cleanUrl.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/);
  if (embedMatch) return embedMatch[1];

  // Pattern 4: youtube.com/shorts/<id>
  const shortsMatch = cleanUrl.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/);
  if (shortsMatch) return shortsMatch[1];

  return null;
}

export function parseVimeoVideoId(url: string): string | null {
  if (!url) return null;
  const match = url.match(/vimeo\.com\/(\d+)/);
  return match ? match[1] : null;
}

export function isDirectVideoUrl(url: string): boolean {
  if (!url) return false;
  return /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(url);
}

export function BlogVideoEmbed({
  url,
  caption,
  aspectRatio = "16/9",
  className = ""
}: BlogVideoEmbedProps) {
  const [loadError, setLoadError] = useState(false);

  const youtubeId = useMemo(() => parseYouTubeVideoId(url), [url]);
  const vimeoId = useMemo(() => parseVimeoVideoId(url), [url]);
  const isDirect = useMemo(() => isDirectVideoUrl(url), [url]);

  if (!url) return null;

  const isVertical = aspectRatio === "9/16" || url.includes("/shorts/");

  return (
    <figure className={`my-8 ${className}`}>
      <div
        className={`relative w-full overflow-hidden rounded-2xl sm:rounded-3xl border border-forest/15 bg-black shadow-card ${
          isVertical ? "max-w-xs mx-auto aspect-[9/16]" : "aspect-video"
        }`}
      >
        {youtubeId ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${youtubeId}?rel=0&modestbranding=1`}
            title={caption || "Video giới thiệu Chạm A Lưới"}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            loading="lazy"
            className="absolute inset-0 h-full w-full border-0"
          />
        ) : vimeoId ? (
          <iframe
            src={`https://player.vimeo.com/video/${vimeoId}?dnt=1`}
            title={caption || "Video giới thiệu Chạm A Lưới"}
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            loading="lazy"
            className="absolute inset-0 h-full w-full border-0"
          />
        ) : isDirect ? (
          <video
            src={url}
            controls
            playsInline
            preload="metadata"
            className="h-full w-full object-contain"
            onError={() => setLoadError(true)}
          />
        ) : (
          /* Fallback generic iframe or direct link player */
          <div className="flex h-full w-full flex-col items-center justify-center gap-3 p-6 text-center text-white">
            <Film className="size-10 text-amber-400" />
            <p className="text-sm font-bold">Video trải nghiệm A Lưới</p>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full bg-forest px-4 py-2 text-xs font-bold text-white hover:bg-forest-light transition"
            >
              <Play className="size-3.5 fill-white" />
              <span>Mở xem video trên nguồn gốc</span>
              <ExternalLink className="size-3" />
            </a>
          </div>
        )}
      </div>

      {caption && (
        <figcaption className="mt-2 text-center text-xs italic text-ink/65">
          🎥 {caption}
        </figcaption>
      )}
    </figure>
  );
}
