import React from "react";
import SignInAgainScreen from "../screens/SignInAgainScreen";
import ErrorScreenHandler from "@/src/utils/ErrorScreenHandler";
import { GetPostObj } from "@/src/utils/API/GetPostObj";
import {
  MEMBER_CREATED_GROUPS_SCHEMA,
  MEMBER_JOINED_GROUPS_SCHEMA,
} from "@/src/utils/schemas/members";
import handleResponses from "@/src/utils/handleResponses";
import { GROUP_ACTIVITY_SCHEMA } from "@/src/utils/schemas/group-activities";
import ErrorActivities from "../screens/ErrorActivities";
import FeedGroupList from "./FeedGroupList";

export default async function FeedGroup({ memberID }: { memberID: string }) {
  if (!memberID) return <SignInAgainScreen />;

  try {
    const host = process.env.HOST;

    // fetch groups member is in
    const MemberObj = GetPostObj({ memberID });
    const res = await fetch(`${host}/api/groups/joined`, MemberObj);
    const body = await res.json();

    if (!body.status) throw new Error(body.error);

    // fetch group member created
    const resA = await fetch(`${host}/api/groups/owned`, MemberObj);
    const bodyA = await resA.json();

    if (!bodyA.status) throw new Error(bodyA.error);

    const joinedGroupsData = body.data as {
      [groupID: string]: MEMBER_JOINED_GROUPS_SCHEMA;
    };
    const ownedGroupsData = bodyA.data as {
      [groupID: string]: MEMBER_CREATED_GROUPS_SCHEMA;
    };

    const groupsList = Object.keys(joinedGroupsData).concat(
      Object.keys(ownedGroupsData)
    );

    // no groups involved
    if (groupsList.length === 0)
      return <ErrorActivities text="Looks like you have no groups joined." />;

    // fetch activities with groups tagged
    const groupActivitiesPromise = groupsList.map(async (groupID: string) => {
      const GroupObj = GetPostObj({ groupID });
      const res = await fetch(
        `${host}/api/activity/global-group-get`,
        GroupObj
      );
      const body = await res.json();

      if (!body.status)
        return handleResponses({ status: false, error: body.error });

      return handleResponses({ data: body.data });
    });

    const groupActivitiesData = {} as {
      [activityID: string]: GROUP_ACTIVITY_SCHEMA;
    };
    const groupActivitiesDataList = await Promise.all(groupActivitiesPromise);

    // loop between groups
    groupActivitiesDataList.forEach((item: any) => {
      if (!item.status) throw new Error(item.error);
      const data = item.data as {
        [activityID: string]: GROUP_ACTIVITY_SCHEMA;
      };
      // loop between activities within group
      Object.keys(data).forEach((activityID: string) => {
        groupActivitiesData[activityID] = data[activityID];
      });
    });

    if (Object.keys(groupActivitiesData).length === 0)
      return (
        <ErrorActivities text="Well, looks like there are no activites here for you." />
      );

    // get all hidden activity IDs from member data
    const resB = await fetch(`${host}/api/activity/get-hidden`, MemberObj);
    const bodyB = await resB.json();

    if (!bodyB.status) throw new Error(bodyB.error);

    // filter hidden activity IDs from all activities keys
    const filteredActivityKeys = Object.keys(groupActivitiesData).filter(
      (activityID: string) => !bodyB.data.includes(activityID)
    );

    // convert array of activity IDs to objects of activityIDs activity data
    var filteredActivities = {} as {
      [activityID: string]: GROUP_ACTIVITY_SCHEMA;
    };
    filteredActivityKeys.forEach((activityID: string) => {
      filteredActivities[activityID] = groupActivitiesData[activityID];
    });

    if (Object.keys(filteredActivities).length === 0)
      return (
        <ErrorActivities text="Well, looks like there are no activites here for you." />
      );

    return (
      <div className="flex w-full flex-col items-start justify-start gap-4">
        <FeedGroupList
          filteredActivities={filteredActivities}
          memberID={memberID}
        />
      </div>
    );
  } catch (err) {
    return ErrorScreenHandler(err);
  }
}
