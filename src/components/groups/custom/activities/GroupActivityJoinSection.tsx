import React from "react";
import { SuspenseGroupActivityFetchType } from "./GroupActivityData";
import { FetchGroupActivityData } from "@/src/utils/activities/group/FetchData";
import ErrorScreenHandler from "@/src/utils/ErrorScreenHandler";
import JoinGroupActivityButton from "./JoinGroupActivityButton";
import LeaveActivityButton from "./LeaveActivityButton";
import AddRemarkButton from "./AddRemarkButton";

export default async function GroupActivityJoinSection({
  memberID,
  activityData,
}: SuspenseGroupActivityFetchType) {
  try {
    const host = process.env.HOST as string;

    const res = await FetchGroupActivityData.getMain({
      activityID: activityData.activityID,
      groupID: activityData.groupID,
      host,
      memberID,
    });

    if (!res.status) throw new Error(res.error);

    const { owner, canJoin, active, currentParticipant } = res.data;

    const resA = await FetchGroupActivityData.getRequests({
      activityID: activityData.activityID,
      groupID: activityData.groupID,
      host,
      memberID,
    });

    if (!resA.status) throw new Error(resA.error);

    const { requested } = resA.data;

    return (
      <>
        {!currentParticipant ? (
          <JoinGroupActivityButton
            active={active}
            activityID={activityData.activityID}
            memberID={memberID}
            canJoin={canJoin}
            requested={requested}
          />
        ) : (
          !owner && (
            <LeaveActivityButton
              active={active}
              activityID={activityData.activityID}
              memberID={memberID}
            />
          )
        )}
        {currentParticipant && !active && (
          <div className="flex flex-col items-start justify-start w-full gap-2">
            <AddRemarkButton
              activityID={activityData.activityID}
              memberID={memberID}
            />
            <p className="text-custom-grey-text text-sm text-start">
              This helps provide feedback for future trainings.
            </p>
          </div>
        )}
      </>
    );
  } catch (err: any) {
    return ErrorScreenHandler(err);
  }
}
