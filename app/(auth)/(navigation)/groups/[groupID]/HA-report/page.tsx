import IndivaHAServerSection from "@/src/components/groups/custom/HA/IndivaHAServerSection";
import LastUpdatedHANotice from "@/src/components/groups/custom/HA/LastUpdatedHANotice";
import HeaderBar from "@/src/components/navigation/HeaderBar";
import CenterFeedSkeleton from "@/src/components/utils/CenterFeedSkeleton";
import { dbHandler } from "@/src/firebase/db";
import ErrorScreenHandler from "@/src/components/ErrorScreenHandler";
import { GROUP_SCHEMA } from "@/src/utils/schemas/groups";
import { Suspense } from "react";
import { getMemberAuthServer } from "@/src/utils/auth/handleServerAuth";

export default async function HAReportPage({
  params,
}: {
  params: { [groupID: string]: string };
}) {
  const { user, isAuthenticated } = await getMemberAuthServer();
  if (!isAuthenticated || user === null) return;
  const groupID = params.groupID;

  try {
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

            <Suspense fallback={<CenterFeedSkeleton height="h-[8vh]" />}>
              <IndivaHAServerSection groupID={groupID} />
            </Suspense>
          </div>
        </div>
      </>
    );
  } catch (err: any) {
    return ErrorScreenHandler(err);
  }
}
