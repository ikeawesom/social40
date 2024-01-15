import DefaultCard from "@/src/components/DefaultCard";
import ErrorScreenHandler from "@/src/utils/ErrorScreenHandler";
import { FetchGroupActivityData } from "@/src/utils/activities/group/FetchData";
import React from "react";
import { SuspenseGroupActivityFetchType } from "./GroupActivityData";
import ActivityParticipantsList from "./ActivityParticipantsList";

export default async function ActivityParticipants({
  groupID,
  activityID,
  memberID,
}: SuspenseGroupActivityFetchType) {
  try {
    const host = process.env.HOST as string;

    const res = await FetchGroupActivityData.getMain({
      activityID,
      groupID,
      host,
      memberID,
    });

    if (!res.status) throw new Error(res.error);

    const { participantsData, admin } = res.data;

    return (
      <DefaultCard className="w-full flex flex-col items-start justify-center gap-2">
        <ActivityParticipantsList
          memberID={memberID}
          activityID={activityID}
          participantsData={participantsData}
          admin={admin}
        />
      </DefaultCard>
    );
  } catch (err: any) {
    return ErrorScreenHandler(err);
  }
}
