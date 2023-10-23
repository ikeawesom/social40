import LoadingScreen from "@/src/components/screens/LoadingScreen";
import Navbar from "@/src/components/navigation/Navbar";
import useFetchUserDataServer from "@/src/utils/useFetchUserDataServer";

export default function NavLayout({ children }: { children: React.ReactNode }) {
  const data = useFetchUserDataServer();
  if (data)
    return (
      <>
        <div className="mb-16 mt-10">{children}</div>
        <Navbar />
      </>
    );
  return <LoadingScreen />;
}
