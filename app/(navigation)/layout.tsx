import Navbar from "@/src/components/navigation/Navbar";
import fetchUserDataServer from "@/src/utils/fetchUserDataServer";

export default function NavLayout({ children }: { children: React.ReactNode }) {
  const data = fetchUserDataServer();
  if (data)
    return (
      <>
        {children}
        <Navbar />
      </>
    );
}
