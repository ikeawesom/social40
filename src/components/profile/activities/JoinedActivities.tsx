import React from "react";
import DefaultCard from "../../DefaultCard";
import { GetPostObj } from "@/src/utils/API/GetPostObj";
import ErrorScreenHandler from "@/src/utils/ErrorScreenHandler";
import { GROUP_ACTIVITY_SCHEMA } from "@/src/utils/schemas/group-activities";
import JoinedActivitiesList from "./JoinedActivitiesList";

export default async function JoinedActivities({
  clickedMemberID,
}: {
  clickedMemberID: string;
}) {
  try {
    const host = process.env.HOST;
    const MemberPost = GetPostObj({ memberID: clickedMemberID });
    const res = await fetch(`${host}/api/profile/group-activities`, MemberPost);
    const body = await res.json();

    if (!body.status) throw new Error(body.error);

    const activitiesData = body.data as {
      [activityID: string]: GROUP_ACTIVITY_SCHEMA;
    };

    return (
      <DefaultCard className="w-full flex flex-col items-start justify-start">
        <JoinedActivitiesList activitiesData={activitiesData} />
      </DefaultCard>
    );
  } catch (err: any) {
    return ErrorScreenHandler(err);
  }
}
