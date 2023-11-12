import React from "react";
import SignInAgainScreen from "../screens/SignInAgainScreen";
import ErrorScreenHandler from "@/src/utils/ErrorScreenHandler";
import { GetPostObj } from "@/src/utils/API/GetPostObj";
import {
  MEMBER_CREATED_GROUPS_SCHEMA,
  MEMBER_JOINED_GROUPS_SCHEMA,
} from "@/src/utils/schemas/members";
import handleResponses from "@/src/utils/handleResponses";
import Image from "next/image";
import { GROUP_ACTIVITY_SCHEMA } from "@/src/utils/schemas/group-activities";
import GroupFeedCard from "./GroupFeedCard";

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
      return (
        <div className="grid place-items-center min-h-[30vh]">
          <div className="flex w-full items-center justify-center gap-4 flex-col">
            <Image
              alt="Activities"
              src="/icons/features/icon_activities_active.svg"
              width={100}
              height={100}
            />
            <h1 className="text-lg text-custom-dark-text text-center">
              Looks like you have no groups joined.
            </h1>
          </div>
        </div>
      );

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

    return (
      <div className="flex w-full flex-col items-start justify-start gap-4">
        {Object.keys(groupActivitiesData).map((activityID: string) => {
          const data = groupActivitiesData[activityID] as GROUP_ACTIVITY_SCHEMA;
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
