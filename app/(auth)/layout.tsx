import PageWrapper from "@/src/components/PageWrapper";
import { AuthProvider } from "@/src/contexts/AuthContext";

export default function NavLayout({ children }: { children: React.ReactNode }) {
  return (
    <PageWrapper>
      <AuthProvider>{children}</AuthProvider>
    </PageWrapper>
  );
}
