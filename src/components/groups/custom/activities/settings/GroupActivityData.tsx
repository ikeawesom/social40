import ErrorScreenHandler from "@/src/components/ErrorScreenHandler";
import React, { Suspense } from "react";
import ActivityWaitlist from "../ActivityWaitlist";
import GroupActivitySettings from "./GroupActivitySettings";
import DeleteGroupActivity from "./DeleteGroupActivity";
import { FetchGroupActivityData } from "@/src/utils/activities/group/FetchData";
import ActivityRemarks from "../ActivityRemarks";
import DefaultSkeleton from "@/src/components/utils/DefaultSkeleton";
import ActivityParticipants from "../participants/ActivityParticipants";
import GroupActivityDetails from "./GroupActivityDetails";
import GroupActivityJoinSection from "./GroupActivityJoinSection";
import { GROUP_ACTIVITY_SCHEMA } from "@/src/utils/schemas/group-activities";
import FalloutsCard from "../participants/FalloutsCard";
import ActivityDownloadSection from "../ActivityDownloadSection";
import { getSimple } from "@/src/utils/helpers/parser";
import { getMemberAuthServer } from "@/src/utils/auth/handleServerAuth";

export type SuspenseGroupActivityFetchType = {
  memberID: string;
  activityData: GROUP_ACTIVITY_SCHEMA;
  isAdmin?: boolean;
};

export default async function GroupActivityData({
  activityID,
  groupID,
}: {
  activityID: string;
  groupID: string;
}) {
  // fetch activity data
  const { user, isAuthenticated } = await getMemberAuthServer();
  if (!isAuthenticated || user === null) return;
  const { memberID } = user;

  try {
    const host = process.env.HOST as string;

    const res = await FetchGroupActivityData.getMain({
      activityID,
      groupID,
      host,
      memberID,
    });

    if (!res.status) throw new Error(res.error);

    const {
      activityData: activityUnparse,
      active,
      admin,
      fallouts: falloutsunParsed,
    } = res.data;

    const resA = await FetchGroupActivityData.getRequests({
      activityID,
      groupID,
      host,
      memberID,
    });

    if (!resA.status) throw new Error(resA.error);
    const { noRequests, requestsData: reqUnparsed } = resA.data;

    const activityData = getSimple(activityUnparse);
    const requestsData = getSimple(reqUnparsed);

    const fallouts = getSimple(falloutsunParsed);
    const falloutsLength = Object.keys(fallouts).length;
    return (
      <div className="w-full flex flex-col items-start justify-center gap-4">
        {!noRequests && admin && (
          <ActivityWaitlist
            requestsData={requestsData}
            activityID={activityID}
          />
        )}
        <Suspense fallback={<DefaultSkeleton />}>
          <GroupActivityDetails
            activityData={activityData}
            memberID={memberID}
            isAdmin={admin}
          />

          <GroupActivityJoinSection
            activityData={activityData}
            memberID={memberID}
          />
        </Suspense>

        <Suspense fallback={<DefaultSkeleton />}>
          <ActivityParticipants
            activityData={activityData}
            memberID={memberID}
          />
        </Suspense>

        {admin && !active && (
          <Suspense fallback={<DefaultSkeleton />}>
            <ActivityRemarks activityID={activityID} groupID={groupID} />
          </Suspense>
        )}
        {admin && falloutsLength > 0 && <FalloutsCard fallouts={fallouts} />}
        {admin && <GroupActivitySettings activityData={activityData} />}
        {admin && <DeleteGroupActivity activityData={activityData} />}
        {admin && (
          <ActivityDownloadSection
            activityData={activityData}
            memberID={memberID}
          />
        )}
        <p className="text-center self-center justify-center text-xs text-custom-grey-text">
          Activity ID: {activityData.activityID}
        </p>
      </div>
    );
  } catch (err: any) {
    return ErrorScreenHandler(err);
  }
}
