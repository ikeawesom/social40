import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Social 40",
  description: "Compete and motivate one another to be the best.",
  manifest: "/pwa/manifest.json",
  icons: { apple: "/pwa/icons/icon-512x512.png" },
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
