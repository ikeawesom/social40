import DefaultCard from "@/src/components/DefaultCard";
import ErrorScreenHandler from "@/src/utils/ErrorScreenHandler";
import { FetchGroupActivityData } from "@/src/utils/activities/group/FetchData";
import React from "react";
import { SuspenseGroupActivityFetchType } from "../settings/GroupActivityData";
import ActivityParticipantsList from "./ActivityParticipantsList";
import InviteMemberForm from "../InviteMemberActivityForm";
import HRow from "@/src/components/utils/HRow";

export default async function ActivityParticipants({
  activityData,
  memberID,
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

    const { participantsData, admin } = res.data;

    return (
      <DefaultCard className="w-full flex flex-col items-start justify-center gap-2">
        <ActivityParticipantsList
          memberID={memberID}
          activityID={activityData.activityID}
          participantsData={participantsData}
          admin={admin}
        />
        {admin && (
          <>
            <HRow />
            <InviteMemberForm
              participants={participantsData}
              activityID={activityData.activityID}
              host={host}
            />
          </>
        )}
      </DefaultCard>
    );
  } catch (err: any) {
    return ErrorScreenHandler(err);
  }
}
