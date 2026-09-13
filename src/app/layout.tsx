import type { Metadata, Viewport } from "next";
import { Onest, Zen_Kaku_Gothic_New } from "next/font/google";
import "./globals.css";
import { AppShell } from "@/components/app-shell";
import { ServiceWorkerRegistration } from "@/components/pwa/service-worker-registration";

const onest = Onest({ subsets: ["latin"], variable: "--font-onest", display: "swap" });
const zenKaku = Zen_Kaku_Gothic_New({ weight: ["400", "500", "700"], variable: "--font-zen-kaku", display: "swap", preload: false });

export const metadata: Metadata = {
  title: { default: "nazumo — Aprende japonés", template: "%s · nazumo" },
  description: "Aprende japonés a tu ritmo, carácter a carácter.",
  applicationName: "nazumo",
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, title: "nazumo", statusBarStyle: "black-translucent" },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#4b18ad",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es"><body className={`${onest.variable} ${zenKaku.variable}`}><ServiceWorkerRegistration /><AppShell>{children}</AppShell></body></html>;
}
