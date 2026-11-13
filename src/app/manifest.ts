import type { MetadataRoute } from "next";

/** PWA manifest(PRD §6.1:对标 apple-mobile-web-app-capable 的现代等价) */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Duo Booth AI — AI Rap Duo Videos",
    short_name: "Duo Booth",
    description:
      "Two photos in, a rap duo video out. Original AI song, no app, about 3 minutes.",
    start_url: "/",
    display: "standalone",
    background_color: "#0b0a10",
    theme_color: "#0b0a10",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
