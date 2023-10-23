import DashboardScreen from "@/src/components/dashboard/DashboardScreen";
import Navbar from "@/src/components/navigation/Navbar";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home",
};

export default async function Home() {
  return (
    <>
      <Navbar />
      <DashboardScreen className="mb-16" />
    </>
  );
}
