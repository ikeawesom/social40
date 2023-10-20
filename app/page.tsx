import DashboardScreen from "@/src/components/dashboard/DashboardScreen";
import Navbar from "@/src/components/navigation/Navbar";
import { getCookies } from "next-client-cookies/server";
import { MEMBER_SCHEMA } from "@/src/utils/schemas/member";

export default async function Home() {
  const cookieStore = getCookies();
  const dataString = cookieStore.get("USER_DATA");

  if (dataString) {
    const data = JSON.parse(dataString) as MEMBER_SCHEMA;
    return (
      <>
        <Navbar />
        <DashboardScreen className="mb-16" data={data} />
      </>
    );
  }
}
