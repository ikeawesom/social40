import Navbar from "@/src/components/navigation/Navbar";
import MaintenanceScreen from "@/src/components/screens/MaintenanceScreen";
import { dbHandler } from "@/src/firebase/db";
import { getMemberAuthServer } from "@/src/utils/auth/handleServerAuth";
import { ROLES_HIERARCHY } from "@/src/utils/constants";
import { MEMBER_SCHEMA } from "@/src/utils/schemas/members";
import { IS_DEBUG } from "@/src/utils/settings";
import { redirect } from "next/navigation";

export default async function NavLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAuthenticated } = await getMemberAuthServer();
  if (!isAuthenticated || user === null) {
    console.log("User not authenticated");
    redirect("/auth");
  }
  const { memberID } = user;

  if (IS_DEBUG.status) {
    const id = memberID;
    const { data }: { data: MEMBER_SCHEMA } = await dbHandler.get({
      col_name: "MEMBERS",
      id,
    });
    const { role } = data;

    if (ROLES_HIERARCHY[role].rank < ROLES_HIERARCHY["memberPlus"].rank)
      return <MaintenanceScreen />;
  }

  return (
    <>
      <div className="mb-16 mt-10">{children}</div>
      <Navbar />
    </>
  );
}
