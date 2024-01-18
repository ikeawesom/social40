import React from "react";
import SignInAgainScreen from "../screens/SignInAgainScreen";
import ErrorScreenHandler from "@/src/utils/ErrorScreenHandler";
import { GetPostObj } from "@/src/utils/API/GetPostObj";
import { GROUP_ACTIVITY_SCHEMA } from "@/src/utils/schemas/group-activities";
import GroupFeedCard from "./GroupFeedCard";
import ErrorActivities from "../screens/ErrorActivities";

export default async function FeedGroup({
  groupID,
  memberID,
}: {
  groupID: string;
  memberID: string;
}) {
  if (!memberID) return <SignInAgainScreen />;

  try {
    const host = process.env.HOST;

    const postObj = GetPostObj({ memberID, groupID });

    // fetch activities with groupID
    const res = await fetch(`${host}/api/groups/get-activities`, postObj);
    const body = await res.json();

    if (!body.status) throw new Error(body.error);

    const groupActivities = body.data as {
      [activityID: string]: GROUP_ACTIVITY_SCHEMA;
    };

    // get all hidden activity IDs from member data
    const resB = await fetch(`${host}/api/activity/get-hidden`, postObj);
    const bodyB = await resB.json();

    if (!bodyB.status) throw new Error(bodyB.error);

    const hiddenActivitiesKeys = bodyB.data as string[];

    // filter hidden activity IDs from all activities keys
    hiddenActivitiesKeys.forEach((id: string) => {
      delete groupActivities[id];
    });

    if (Object.keys(groupActivities).length === 0)
      return (
        <ErrorActivities text="Well, looks like there are no activites here for you." />
      );

    return (
      <div className="flex w-full flex-col items-start justify-start gap-4">
        {Object.keys(groupActivities).map((activityID: string) => {
          const data = groupActivities[activityID] as GROUP_ACTIVITY_SCHEMA;
          return (
            <GroupFeedCard
              key={activityID}
              memberID={memberID}
              activityData={data}
            />
          );
        })}
      </div>
    );
  } catch (err) {
    return ErrorScreenHandler(err);
  }
}
