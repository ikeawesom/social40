import type { Metadata } from "next";
import "./globals.css";
import PageWrapper from "@/src/components/PageWrapper";
import { Toaster } from "sonner";
import { AuthProvider } from "@/src/contexts/AuthContext";
import { cookies } from "next/headers";
import { ClientCookiesProvider } from "@/src/contexts/CookiesProvider";

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
      <body>
        <ClientCookiesProvider value={cookies().getAll()}>
          <AuthProvider>
            <Toaster richColors position="top-center" />
            <PageWrapper>{children}</PageWrapper>
          </AuthProvider>
        </ClientCookiesProvider>
      </body>
    </html>
  );
}
