import Navbar from "@/src/components/navigation/Navbar";
import MaintenanceScreen from "@/src/components/screens/MaintenanceScreen";
import SignInAgainScreen from "@/src/components/screens/SignInAgainScreen";
import { dbHandler } from "@/src/firebase/db";
import { ROLES_HIERARCHY } from "@/src/utils/constants";
import { MEMBER_SCHEMA } from "@/src/utils/schemas/members";
import { IS_DEBUG } from "@/src/utils/settings";
import { cookies } from "next/headers";

export default async function NavLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = cookies();
  const cookieItem = cookieStore.get("memberID");

  if (!cookieItem) return <SignInAgainScreen />;

  if (IS_DEBUG.status) {
    if (IS_DEBUG.membersOnly) {
      const id = cookieItem.value;
      const { data }: { data: MEMBER_SCHEMA } = await dbHandler.get({
        col_name: "MEMBERS",
        id,
      });
      const { role } = data;
      if (ROLES_HIERARCHY[role].rank < ROLES_HIERARCHY["admin"].rank)
        return <MaintenanceScreen />;
    } else {
      return <MaintenanceScreen />;
    }
  }
  return (
    <>
      <div className="mb-16 mt-10">{children}</div>
      <Navbar />
    </>
  );
}
