"use client";
import { GROUP_ACTIVITY_SCHEMA } from "@/src/utils/schemas/group-activities";
import React from "react";
import GroupFeedCard from "./GroupFeedCard";
import useQueryObj from "@/src/hooks/useQueryObj";
import QueryInput from "../utils/QueryInput";

export default function FeedGroupList({
  filteredActivities,
  memberID,
}: {
  filteredActivities: {
    [activityID: string]: GROUP_ACTIVITY_SCHEMA;
  };
  memberID: string;
}) {
  const { handleSearch, itemList, search } = useQueryObj({
    obj: filteredActivities,
    type: "activityTitle",
  });
  return (
    <>
      <QueryInput
        handleSearch={handleSearch}
        placeholder={"Search for activity title"}
        search={search}
        className="m-0"
      />
      {Object.keys(itemList).map((activityID: string) => {
        const data = itemList[activityID] as GROUP_ACTIVITY_SCHEMA;
        return (
          <GroupFeedCard
            key={activityID}
            memberID={memberID}
            activityData={data}
          />
        );
      })}
    </>
  );
}
