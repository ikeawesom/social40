import SignoutButton from "@/src/components/utils/SignoutButton";
import { getCookies } from "next-client-cookies/server";
import { dbHandler } from "@/src/firebase/db";
import DashboardScreen from "@/src/components/dashboard/DashboardScreen";
import { redirect } from "next/navigation";
import Navbar from "@/src/components/navigation/Navbar";
import { MEMBER_SCHEMA } from "@/src/utils/schemas/member";

export default async function Home() {
  const cookieStore = getCookies();
  const UID = cookieStore.get("UID");

  if (UID) {
    var { status, data, error } = await dbHandler.get({
      col_name: "MEMBERS",
      id: UID,
    });

    data = data as MEMBER_SCHEMA;
    if (status) {
      return (
        <>
          <Navbar />
          <DashboardScreen className="mb-16" data={data} />
        </>
      );
    }
    // user not in database
    console.log(error);
  }
}
