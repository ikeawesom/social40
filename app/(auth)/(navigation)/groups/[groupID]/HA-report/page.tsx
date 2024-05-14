import GroupHALoadingSkeleton from "@/src/components/groups/custom/HA/GroupHALoadingSkeleton";
import GroupHAServerSection from "@/src/components/groups/custom/HA/GroupHAServerSection";
import HAOptions from "@/src/components/groups/custom/HA/HAOptions";
import IndivaHAServerSection from "@/src/components/groups/custom/HA/IndivaHAServerSection";
import LastUpdatedHANotice from "@/src/components/groups/custom/HA/LastUpdatedHANotice";
import HeaderBar from "@/src/components/navigation/HeaderBar";
import SignInAgainScreen from "@/src/components/screens/SignInAgainScreen";
import CenterFeedSkeleton from "@/src/components/utils/CenterFeedSkeleton";
import { dbHandler } from "@/src/firebase/db";
import ErrorScreenHandler from "@/src/utils/ErrorScreenHandler";
import { GROUP_SCHEMA } from "@/src/utils/schemas/groups";
import { cookies } from "next/headers";
import { Suspense } from "react";

export default async function HAReportPage({
  params,
  searchParams,
}: {
  params: { [groupID: string]: string };
  searchParams: { [type: string]: string };
}) {
  const cookieStore = cookies();
  const groupID = params.groupID;
  const data = cookieStore.get("memberID");

  if (!data) return <SignInAgainScreen />;

  try {
    const type =
      searchParams.type !== "group" && searchParams.type !== "indiv"
        ? "group"
        : searchParams.type ?? "group";

    const { data: groupDataRes, error: groupErr } = await dbHandler.get({
      col_name: "GROUPS",
      id: groupID,
    });
    if (groupErr || !groupID) throw new Error("Invalid group.");
    const groupData = groupDataRes as GROUP_SCHEMA;
    const { lastUpdatedHA } = groupData;
    return (
      <>
        <HeaderBar back text={`HA Reports for ${groupID}`} />
        <div className="w-full grid place-items-center">
          <div className="flex flex-col items-center justify-center gap-2 w-full max-w-[500px] text-center">
            {lastUpdatedHA && (
              <LastUpdatedHANotice lastUpdatedHA={lastUpdatedHA} />
            )}
            <HAOptions type={type} />
            {type === "indiv" ? (
              <Suspense fallback={<CenterFeedSkeleton height="h-[8vh]" />}>
                <IndivaHAServerSection key={type} groupID={groupID} />
              </Suspense>
            ) : (
              <Suspense fallback={<GroupHALoadingSkeleton />} key={type}>
                <GroupHAServerSection groupID={groupID} />
              </Suspense>
            )}
          </div>
        </div>
      </>
    );
  } catch (err: any) {
    return ErrorScreenHandler(err);
  }
}
