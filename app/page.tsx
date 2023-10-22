import DashboardScreen from "@/src/components/dashboard/DashboardScreen";
import Navbar from "@/src/components/navigation/Navbar";
import useFetchUserDataServer from "@/src/utils/useFetchUserDataServer";

export default async function Home() {
  const data = useFetchUserDataServer();
  if (data)
    return (
      <>
        <Navbar />
        <DashboardScreen className="mb-16" data={data} />
      </>
    );
}
