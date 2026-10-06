import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "AI Health Report Explainer",
    template: "%s | AI Health Report Explainer",
  },
  description:
    "Understand your health reports in simple language. AI Health Report Explainer turns complex medical report terminology into clear, easy-to-read explanations.",
  keywords: [
    "health report",
    "medical report explainer",
    "understand blood test",
    "health report summary",
    "medical terminology",
  ],
  authors: [{ name: "AI Health Report Explainer" }],
  robots: "index, follow",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
