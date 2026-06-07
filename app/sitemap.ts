import type { MetadataRoute } from "next";

const baseUrl = "https://vivasports.in";

const routes = [
  { path: "/", priority: 1, changeFrequency: "daily" },
  { path: "/live", priority: 0.95, changeFrequency: "always" },
  { path: "/fixtures", priority: 0.9, changeFrequency: "daily" },
  { path: "/results", priority: 0.9, changeFrequency: "daily" },
  { path: "/points-table", priority: 0.85, changeFrequency: "daily" },
  { path: "/points_table", priority: 0.7, changeFrequency: "daily" },
  { path: "/pointstable", priority: 0.65, changeFrequency: "daily" },
  { path: "/teams", priority: 0.8, changeFrequency: "weekly" },
  { path: "/matches", priority: 0.8, changeFrequency: "daily" },
  { path: "/admin", priority: 0.35, changeFrequency: "monthly" },
  { path: "/players", priority: 0.75, changeFrequency: "weekly" },
  { path: "/leaderboards", priority: 0.75, changeFrequency: "daily" },
  { path: "/stats", priority: 0.7, changeFrequency: "weekly" },
  { path: "/gallery", priority: 0.55, changeFrequency: "monthly" },
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return routes.map((route) => ({
    url: `${baseUrl}${route.path}`,
    lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
