import type { Metadata, Viewport } from "next";
import { Onest, Zen_Kaku_Gothic_New } from "next/font/google";
import "./globals.css";
import { AppShell } from "@/components/app-shell";
import { ServiceWorkerRegistration } from "@/components/pwa/service-worker-registration";

const onest = Onest({ subsets: ["latin"], variable: "--font-onest", display: "swap" });
const zenKaku = Zen_Kaku_Gothic_New({ weight: ["400", "500", "700"], variable: "--font-zen-kaku", display: "swap", preload: false });

export const metadata: Metadata = {
  title: { default: "KAKU — Aprende japonés", template: "%s · KAKU" },
  description: "Aprende japonés, trazo a trazo.",
  applicationName: "Kana",
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, title: "Kana", statusBarStyle: "black-translucent" },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#37158f",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es"><body className={`${onest.variable} ${zenKaku.variable}`}><ServiceWorkerRegistration /><AppShell>{children}</AppShell></body></html>;
}
