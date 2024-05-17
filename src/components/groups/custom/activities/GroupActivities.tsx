"use client";
import React from "react";
import { GROUP_ACTIVITIES_SCHEMA } from "@/src/utils/schemas/groups";
import DefaultCard from "../../../DefaultCard";
import InnerContainer from "../../../utils/InnerContainer";
import { twMerge } from "tailwind-merge";
import GroupActivityTab from "./settings/GroupActivityTab";
import CreateActivityButton from "./settings/create/CreateActivityButton";
import useQueryObj from "@/src/hooks/useQueryObj";
import QueryInput from "../../../utils/QueryInput";
import {
  DateToTimestamp,
  ActiveTimestamp,
} from "@/src/utils/helpers/getCurrentDate";
import Link from "next/link";

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
  const upcomingActivities = {} as GroupActivitiesType;

  Object.keys(activitiesData).forEach((activityID: string) => {
    const tempTimestamp = activitiesData[activityID].activityDate;
    const tempDate = new Date(tempTimestamp.seconds * 1000);
    const date = DateToTimestamp(tempDate);
    const active = ActiveTimestamp(date);
    if (active) upcomingActivities[activityID] = activitiesData[activityID];
  });

  const { handleSearch, itemList, search } = useQueryObj({
    obj: upcomingActivities,
    type: "activityTitle",
  });

  const empty = Object.keys(itemList).length === 0;
  return (
    <DefaultCard className="w-full">
      <h1 className="text-custom-dark-text font-semibold mb-2">
        Upcoming Activities ( {Object.keys(itemList).length} )
      </h1>
      <QueryInput
        handleSearch={handleSearch}
        placeholder="Search activity name"
        search={search}
      />
      <InnerContainer
        className={twMerge(
          "min-h-[10vh] max-h-[60vh] my-2 overflow-y-visible overflow-x-hidden",
          empty && "grid place-items-center justify-center overflow-hidden p-4"
        )}
      >
        {empty ? (
          <p className="text-sm text-custom-grey-text text-center">
            {search === "" ? "No upcoming activites!" : "Nothing found here..."}
          </p>
        ) : (
          Object.keys(itemList).map((activityID: string | undefined) => {
            if (activityID !== undefined) {
              const activityData = itemList[activityID];
              return (
                <GroupActivityTab
                  activityData={activityData}
                  key={activityID}
                />
              );
            }
          })
        )}
      </InnerContainer>
      <div className="w-full flex items-center justify-end gap-x-4 gap-y-2 flex-wrap">
        <Link
          scroll={false}
          href={`/groups/${groupID}/activities`}
          className="text-start underline text-sm duration-150 text-custom-grey-text hover:text-custom-primary"
        >
          View all activites ( {Object.keys(activitiesData).length} )
        </Link>
        {admin && <CreateActivityButton group groupID={groupID} />}
      </div>
    </DefaultCard>
  );
}
