import React from "react";
import DefaultCard from "../../DefaultCard";
import { GetPostObj } from "@/src/utils/API/GetPostObj";
import ErrorScreenHandler from "@/src/utils/ErrorScreenHandler";
import { GROUP_ACTIVITY_SCHEMA } from "@/src/utils/schemas/group-activities";
import JoinedActivitiesList from "./JoinedActivitiesList";
import { dbHandler } from "@/src/firebase/db";
import { ACTIVITY_PARTICIPANT_SCHEMA } from "@/src/utils/schemas/members";
import handleResponses from "@/src/utils/handleResponses";

export default async function JoinedActivities({
  clickedMemberID,
}: {
  clickedMemberID: string;
}) {
  try {
    // get member's group activities data
    const res = await dbHandler.getSpecific({
      path: `MEMBERS/${clickedMemberID}/GROUP-ACTIVITIES`,
      orderCol: "activityDate",
      ascending: false,
    });

    if (!res.status) throw new Error(res.error);

    const joinedActivities = res.data as {
      [activityID: string]: ACTIVITY_PARTICIPANT_SCHEMA;
    };

    const activitesDataPromise = Object.keys(joinedActivities).map(
      async (activityID: string) => {
        // get each group activity data
        const res = await dbHandler.get({
          col_name: `GROUP-ACTIVITIES`,
          id: activityID,
        });
        if (!res.status)
          return handleResponses({ status: false, error: res.error });
        return handleResponses({ data: res.data });
      }
    );

    const activitiesDataList = await Promise.all(activitesDataPromise);

    const activitiesDataObj = {} as {
      [activityID: string]: GROUP_ACTIVITY_SCHEMA;
    };

    // sort the data in descending order
    const sortedActivitiesList = [] as GROUP_ACTIVITY_SCHEMA[];

    activitiesDataList.forEach((item: any) => {
      if (!item.status) throw new Error(item.error);
      const data = item.data as GROUP_ACTIVITY_SCHEMA;
      sortedActivitiesList.push(data);
    });

    sortedActivitiesList.sort(function (a, b) {
      return (
        new Date(b.activityDate.seconds * 1000).getTime() -
        new Date(a.activityDate.seconds * 1000).getTime()
      );
    });

    sortedActivitiesList.forEach((item: GROUP_ACTIVITY_SCHEMA) => {
      const activityID = item.activityID;
      activitiesDataObj[activityID] = item;
    });

    return (
      <DefaultCard className="w-full flex flex-col items-start justify-start">
        <JoinedActivitiesList
          activitiesData={JSON.parse(JSON.stringify(activitiesDataObj))}
        />
      </DefaultCard>
    );
  } catch (err: any) {
    return ErrorScreenHandler(err);
  }
}
