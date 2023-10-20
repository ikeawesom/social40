import Navbar from "@/src/components/navigation/Navbar";
import { getCookies } from "next-client-cookies/server";

export default function NavLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = getCookies();
  const data = cookieStore.get("USER_DATA");
  if (data)
    return (
      <>
        {children}
        <Navbar />
      </>
    );
}
