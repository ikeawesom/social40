import React from "react";
import ErrorScreenHandler from "@/src/components/ErrorScreenHandler";
import { GROUP_ACTIVITY_SCHEMA } from "@/src/utils/schemas/group-activities";
import { dbHandler } from "@/src/firebase/db";
import { ACTIVITY_PARTICIPANT_SCHEMA } from "@/src/utils/schemas/members";
import handleResponses from "@/src/utils/helpers/handleResponses";
import HRow from "../../utils/HRow";
import RecentActivitiesSection from "./RecentActivitiesSection";
import UpcomingActivitiesSection from "./UpcomingActivitiesSection";

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
    const parsed = JSON.parse(JSON.stringify(activitiesDataObj));
    return (
      <div className="flex items-start justify-start flex-col w-full gap-4">
        <UpcomingActivitiesSection activitiesData={parsed} />
        <HRow className="bg-custom-grey-text/50" />
        <RecentActivitiesSection activitiesData={parsed} />
      </div>
    );
  } catch (err: any) {
    return ErrorScreenHandler(err);
  }
}
