import DashboardScreen from "@/src/components/dashboard/DashboardScreen";
import Navbar from "@/src/components/navigation/Navbar";
import fetchUserDataServer from "@/src/utils/fetchUserDataServer";

export default async function Home() {
  const data = fetchUserDataServer();
  if (data)
    return (
      <>
        <Navbar />
        <DashboardScreen className="mb-16" data={data} />
      </>
    );
}
