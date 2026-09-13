import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "nazumo",
    short_name: "nazumo",
    description: "Una aplicación para aprender japonés practicando hiragana, katakana y kanji.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#faf8f2",
    theme_color: "#4b18ad",
    lang: "es",
    icons: [
      { src: "/icons/kana-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/kana-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/kana-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
