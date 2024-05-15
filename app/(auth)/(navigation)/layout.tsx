import Navbar from "@/src/components/navigation/Navbar";
import MaintenanceScreen from "@/src/components/screens/MaintenanceScreen";
import SignInAgainScreen from "@/src/components/screens/SignInAgainScreen";
import { IS_DEBUG } from "@/src/utils/settings";
import { cookies } from "next/headers";

export default function NavLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = cookies();
  const data = cookieStore.get("memberID");

  if (!data) return <SignInAgainScreen />;

  if (IS_DEBUG) return <MaintenanceScreen />;
  return (
    <>
      <div className="mb-16 mt-10">{children}</div>
      <Navbar />
    </>
  );
}
