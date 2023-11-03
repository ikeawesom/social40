import { AuthProvider } from "@/src/contexts/AuthContext";

export default function NavLayout({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}
