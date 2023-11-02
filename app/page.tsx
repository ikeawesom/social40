import DashboardScreen from "@/src/components/dashboard/DashboardScreen";
import HeaderBar from "@/src/components/navigation/HeaderBar";
import Navbar from "@/src/components/navigation/Navbar";
import SignInAgainScreen from "@/src/components/screens/SignInAgainScreen";
import { Metadata } from "next";
import { cookies } from "next/headers";

export const metadata: Metadata = {
  title: "Home",
};

export default async function Home() {
  const cookieStore = cookies();
  const data = cookieStore.get("memberID");
  if (data) {
    const memberID = data.value;

    return (
      <>
        <HeaderBar text="Home" />
        <DashboardScreen className="mb-16" />
        <Navbar />
      </>
    );
  }
  return <SignInAgainScreen />;
}
