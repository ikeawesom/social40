import React from "react";
import SignInAgainScreen from "../screens/SignInAgainScreen";
import ErrorScreenHandler from "@/src/utils/ErrorScreenHandler";
import { GROUP_ACTIVITY_SCHEMA } from "@/src/utils/schemas/group-activities";
import ErrorActivities from "../screens/ErrorActivities";
import { dbHandler } from "@/src/firebase/db";
import { MEMBER_SCHEMA } from "@/src/utils/schemas/members";
import FeedGroupClient from "./FeedGroupClient";

export default async function FeedGroup({
  groupID,
  memberID,
}: {
  groupID: string;
  memberID: string;
}) {
  if (!memberID) return <SignInAgainScreen />;

  try {
    // fetch activities with groupID
    const { data: activitiesRes, error: actErr } = await dbHandler.getSpecific({
      path: `GROUPS/${groupID}/GROUP-ACTIVITIES`,
      orderCol: "activityDate",
      ascending: false,
    });
    if (actErr) throw new Error(actErr);

    const groupActivities = activitiesRes as {
      [activityID: string]: GROUP_ACTIVITY_SCHEMA;
    };

    // get all hidden activity IDs from member data
    const { data: memberRes, error: hiddenErr } = await dbHandler.get({
      col_name: "MEMBERS",
      id: memberID,
    });
    if (hiddenErr) throw new Error(hiddenErr);

    const memberData = memberRes as MEMBER_SCHEMA;
    const hiddenActivities = memberData.hiddenActivities ?? [];

    // filter hidden activity IDs from all activities keys
    Object.keys(hiddenActivities).forEach((id: string) => {
      delete groupActivities[id];
    });

    if (Object.keys(groupActivities).length === 0)
      return (
        <ErrorActivities text="Well, looks like there are no activites here for you." />
      );

    return <FeedGroupClient groupID={groupID} hidden={hiddenActivities} />;
  } catch (err) {
    return ErrorScreenHandler(err);
  }
}
