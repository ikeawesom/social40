import type { Metadata } from "next";
import "./globals.css";
import PageWrapper from "@/src/components/PageWrapper";
import { Toaster } from "sonner";
import { AuthProvider } from "@/src/contexts/AuthContext";

export const metadata: Metadata = {
  title: { template: "%s | Social 40", default: "Social 40" },
  description: "Manage, track and monitor progress while striving for victory.",
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
      <body>
        <Toaster richColors position="top-center" />
        <PageWrapper>{children}</PageWrapper>
      </body>
    </html>
  );
}
