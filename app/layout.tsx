import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";
import { isFullMaintenance } from "@/src/utils/settings";
import MaintenanceScreen from "@/src/components/screens/MaintenanceScreen";

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
        {isFullMaintenance ? <MaintenanceScreen /> : children}
      </body>
    </html>
  );
}
