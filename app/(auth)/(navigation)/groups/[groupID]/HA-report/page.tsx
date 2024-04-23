import GroupHASection from "@/src/components/groups/custom/HA/GroupHASection";
import HeaderBar from "@/src/components/navigation/HeaderBar";
import SignInAgainScreen from "@/src/components/screens/SignInAgainScreen";
import { dbHandler } from "@/src/firebase/db";
import ErrorScreenHandler from "@/src/utils/ErrorScreenHandler";
import { cookies } from "next/headers";

export default async function HAReportPage({
  params,
}: {
  params: { [groupID: string]: string };
}) {
  const cookieStore = cookies();
  const groupID = params.groupID;
  const data = cookieStore.get("memberID");

  if (!data) return <SignInAgainScreen />;

  try {
    if (!groupID) throw new Error("Invalid group.");

    const { error } = await dbHandler.get({ col_name: "GROUPS", id: groupID });
    if (error) throw new Error(error);

    return (
      <>
        <HeaderBar back text={`HA Results for ${groupID}`} />
        <div className="w-full grid place-items-center">
          <div className="flex flex-col items-center justify-center gap-2 w-full max-w-[500px]">
            <GroupHASection groupID={groupID} />
          </div>
        </div>
      </>
    );
  } catch (err: any) {
    return ErrorScreenHandler(err);
  }
}
