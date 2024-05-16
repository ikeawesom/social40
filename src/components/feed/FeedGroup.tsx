import React from "react";
import SignInAgainScreen from "../screens/SignInAgainScreen";
import ErrorScreenHandler from "@/src/components/ErrorScreenHandler";
import { dbHandler } from "@/src/firebase/db";
import { MEMBER_SCHEMA } from "@/src/utils/schemas/members";
import FeedGroupClient from "./FeedGroupClient";
import { GROUP_ACTIVITIES_SCHEMA } from "@/src/utils/schemas/groups";
import { FetchPaginateActivity } from "@/src/utils/home/ActivityFeed";

export default async function FeedGroup({
  groupID,
  memberID,
}: {
  groupID: string;
  memberID: string;
}) {
  if (!memberID) return <SignInAgainScreen />;

  try {
    // get all hidden activity IDs from member data
    const { data: memberRes, error: hiddenErr } = await dbHandler.get({
      col_name: "MEMBERS",
      id: memberID,
    });
    if (hiddenErr) throw new Error(hiddenErr);

    const memberData = memberRes as MEMBER_SCHEMA;
    const hiddenActivities = memberData.hiddenActivities ?? [];

    // fetch activities with groupID
    const { data: activitiesRes, error: actErr } = await FetchPaginateActivity({
      hidden: hiddenActivities,
      path: `GROUPS/${groupID}/GROUP-ACTIVITIES`,
    });
    if (actErr) throw new Error(actErr);
    const { data, lastPointer } = activitiesRes;
    const groupActivities = data as GROUP_ACTIVITIES_SCHEMA[];

    return (
      <FeedGroupClient
        lastPointer={lastPointer}
        activities={groupActivities}
        groupID={groupID}
        hidden={hiddenActivities}
      />
    );
  } catch (err) {
    return ErrorScreenHandler(err);
  }
}
