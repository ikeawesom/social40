"use client";
import React from "react";
import { GROUP_ACTIVITIES_SCHEMA } from "@/src/utils/schemas/groups";
import DefaultCard from "../../DefaultCard";
import HRow from "../../utils/HRow";
import InnerContainer from "../../utils/InnerContainer";
import { twMerge } from "tailwind-merge";
import GroupActivityTab from "./activities/GroupActivityTab";
import CreateActivityButton from "./activities/CreateActivityButton";
import useQueryObj from "@/src/hooks/useQueryObj";
import QueryInput from "../../utils/QueryInput";

export type GroupActivitiesType = {
  [activityID: string]: GROUP_ACTIVITIES_SCHEMA;
};

export default function GroupActivities({
  activitiesData,
  admin,
  groupID,
}: {
  activitiesData: GroupActivitiesType;
  admin: boolean;
  groupID: string;
}) {
  const { handleSearch, itemList, search } = useQueryObj({
    obj: activitiesData,
    type: "activityTitle",
  });
  const empty = Object.keys(itemList).length === 0;
  return (
    <DefaultCard className="w-full">
      <h1 className="text-custom-dark-text font-semibold mb-2">
        Group Activities ( {Object.keys(itemList).length} )
      </h1>
      <QueryInput
        handleSearch={handleSearch}
        placeholder="Search activity name"
        search={search}
      />
      <InnerContainer
        className={twMerge(
          "min-h-[10vh] my-2 max-h-[100vh]",
          empty && "grid place-items-center justify-center overflow-hidden p-4"
        )}
      >
        {empty ? (
          <p className="text-sm text-custom-grey-text text-center">
            {search === ""
              ? "No activities have been created in this group..."
              : "Nothing found here..."}
          </p>
        ) : (
          Object.keys(itemList).map((activityID: string) => {
            const activityData = itemList[activityID];
            return (
              <GroupActivityTab activityData={activityData} key={activityID} />
            );
          })
        )}
      </InnerContainer>
      {admin && (
        <div className="w-full flex items-center justify-end">
          <CreateActivityButton group groupID={groupID} />
        </div>
      )}
    </DefaultCard>
  );
}
