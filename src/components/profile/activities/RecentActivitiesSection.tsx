"use client";
import useQueryObj from "@/src/hooks/useQueryObj";
import { GROUP_ACTIVITY_SCHEMA } from "@/src/utils/schemas/group-activities";
import React from "react";
import QueryInput from "../../utils/QueryInput";
import DefaultCard from "../../DefaultCard";
import GroupActivityTab from "../../groups/custom/activities/settings/GroupActivityTab";
import ErrorSection from "../../utils/ErrorSection";

export default function RecentActivitiesSection({
  activitiesData,
}: {
  activitiesData: {
    [activityID: string]: GROUP_ACTIVITY_SCHEMA;
  };
}) {
  const { handleSearch, itemList, search } = useQueryObj({
    obj: activitiesData,
    type: "activityTitle",
  });

  const filteredDataRecent = {} as {
    [activityID: string]: GROUP_ACTIVITY_SCHEMA;
  };

  Object.keys(itemList).forEach((id: string) => {
    const now = new Date();
    const { activityDate } = activitiesData[id];
    const date = new Date(activityDate.seconds * 1000);
    if (date < now) filteredDataRecent[id] = activitiesData[id];
  });

  const emptyRecent = Object.keys(filteredDataRecent).length === 0;

  return (
    <div className="flex items-start justify-start flex-col w-full gap-1">
      <h1 className="text-custom-dark-text font-semibold mb-1">
        Recents ( {Object.keys(filteredDataRecent).length} )
      </h1>
      <QueryInput
        handleSearch={handleSearch}
        placeholder="Search for activity name"
        search={search}
      />
      {emptyRecent ? (
        <ErrorSection
          className="bg-white rounded-md"
          errorMsg="All caught up with!"
          noTitle
        />
      ) : (
        Object.keys(filteredDataRecent).map((activityID: string) => {
          const activityData = itemList[activityID];
          return (
            <DefaultCard
              key={activityID}
              className="w-full p-0 overflow-hidden"
            >
              <GroupActivityTab activityData={activityData} key={activityID} />
            </DefaultCard>
          );
        })
      )}
    </div>
  );
}
