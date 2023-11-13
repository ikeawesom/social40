import React from "react";
import { GROUP_ACTIVITIES_SCHEMA } from "@/src/utils/schemas/groups";
import DefaultCard from "../../DefaultCard";
import HRow from "../../utils/HRow";
import InnerContainer from "../../utils/InnerContainer";
import { twMerge } from "tailwind-merge";
import GroupActivityTab from "./activities/GroupActivityTab";
import CreateActivityButton from "./activities/CreateActivityButton";

export type GroupActivitiesType = {
  [activityID: string]: GROUP_ACTIVITIES_SCHEMA;
};

export default function GroupActivities({
  activitiesData,
  owner,
  groupID,
}: {
  activitiesData: GroupActivitiesType;
  owner: boolean;
  groupID: string;
}) {
  const empty = Object.keys(activitiesData).length === 0;

  return (
    <DefaultCard className="w-full">
      <h1 className="text-custom-dark-text font-semibold">Group Activities</h1>
      <HRow />
      <InnerContainer
        className={twMerge(
          "min-h-[10vh] my-2 max-h-[100vh]",
          empty && "grid place-items-center justify-center overflow-hidden"
        )}
      >
        {empty ? (
          <p className="text-sm text-custom-grey-text text-center">
            Group owner has not added any activities...
          </p>
        ) : (
          Object.keys(activitiesData).map((activityID: string) => {
            const activityData = activitiesData[activityID];
            return (
              <GroupActivityTab activityData={activityData} key={activityID} />
            );
          })
        )}
      </InnerContainer>
      {owner && (
        <div className="w-full flex items-center justify-end">
          <CreateActivityButton group groupID={groupID} />
        </div>
      )}
    </DefaultCard>
  );
}
