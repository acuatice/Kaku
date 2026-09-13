import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Kana",
    short_name: "Kana",
    description: "Una aplicación para aprender japonés practicando hiragana, katakana y kanji.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#f7f6f1",
    theme_color: "#37158f",
    lang: "es",
    icons: [
      { src: "/icons/kana-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/kana-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/kana-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
