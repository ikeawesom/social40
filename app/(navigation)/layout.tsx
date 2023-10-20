import Navbar from "@/src/components/navigation/Navbar";
import { getCookies } from "next-client-cookies/server";

export default function NavLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = getCookies();
  const UID = cookieStore.get("UID");
  if (UID)
    return (
      <>
        {children}
        <Navbar />
      </>
    );
}
