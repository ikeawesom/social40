import DefaultCard from "@/src/components/DefaultCard";
import ErrorScreenHandler from "@/src/components/ErrorScreenHandler";
import { FetchGroupActivityData } from "@/src/utils/activities/group/FetchData";
import React from "react";
import { SuspenseGroupActivityFetchType } from "../settings/GroupActivityData";
import ActivityParticipantsList from "./ActivityParticipantsList";
import InviteMemberActivityForm from "../InviteMemberActivityForm";
import HRow from "@/src/components/utils/HRow";
import { getSimple } from "@/src/utils/helpers/parser";
import ActivityInvite from "../ActivityInvite";

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
    const parsed = getSimple(participantsData);

    return (
      <DefaultCard className="w-full flex flex-col items-start justify-center gap-2">
        <ActivityParticipantsList
          memberID={memberID}
          activityID={activityData.activityID}
          participantsData={parsed}
          admin={admin}
        />
        {admin && (
          <>
            <HRow />
            {/* <InviteMemberActivityForm
              participants={parsed}
              activityID={activityData.activityID}
              host={host}
            /> */}
            <ActivityInvite
              activityID={activityData.activityID}
              participants={Object.keys(parsed)}
            />
          </>
        )}
      </DefaultCard>
    );
  } catch (err: any) {
    return ErrorScreenHandler(err);
  }
}
