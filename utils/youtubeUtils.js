export function getYouTubeVideoId(url = "") {
  const value = String(url || "").trim();

  if (!value) return "";

  try {
    const parsed = new URL(value);
    const host = parsed.hostname.replace(/^www\./, "");

    if (host === "youtu.be") {
      return parsed.pathname.split("/").filter(Boolean)[0] || "";
    }

    if (host === "youtube.com" || host === "m.youtube.com") {
      if (parsed.pathname === "/watch") return parsed.searchParams.get("v") || "";
      if (parsed.pathname.startsWith("/live/")) {
        return parsed.pathname.split("/").filter(Boolean)[1] || "";
      }
      if (parsed.pathname.startsWith("/embed/")) {
        return parsed.pathname.split("/").filter(Boolean)[1] || "";
      }
      if (parsed.pathname.startsWith("/shorts/")) {
        return parsed.pathname.split("/").filter(Boolean)[1] || "";
      }
    }
  } catch {
    return value;
  }

  return "";
}

export function getYouTubeEmbedUrl(url = "") {
  const id = getYouTubeVideoId(url);

  return id ? `https://www.youtube.com/embed/${id}` : "";
}

export function getMatchYouTubeUrl(match = {}) {
  return (
    match.youtubeEmbedUrl ||
    getYouTubeEmbedUrl(
      match.youtubeLink ||
        match.youtubeUrl ||
        match.streamUrl ||
        match.youtubeStream ||
        match.liveStream ||
        ""
    )
  );
}
