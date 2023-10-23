import DashboardScreen from "@/src/components/dashboard/DashboardScreen";
import Navbar from "@/src/components/navigation/Navbar";

export default async function Home() {
  return (
    <>
      <Navbar />
      <DashboardScreen className="mb-16" />
    </>
  );
}
