"use client";

import { GROUP_ACTIVITY_SCHEMA } from "@/src/utils/schemas/group-activities";
import React, { useState } from "react";
import FeedGroupCardClient from "./FeedGroupCardClient";
import { useMemberID } from "@/src/hooks/useMemberID";
import ErrorActivities from "../screens/ErrorActivities";

export default function HiddenActivitiesSection({
  groupActivitiesData,
}: {
  groupActivitiesData: GROUP_ACTIVITY_SCHEMA[];
}) {
  const { memberID } = useMemberID();
  const [activities, setActivities] = useState(groupActivitiesData);

  const toggleView = (index: number) => {
    let temp = [...activities];
    temp.splice(index, 1);
    setActivities(temp);
  };

  if (activities.length === 0)
    return (
      <ErrorActivities text="Well, looks like there are no activites here for you." />
    );

  return activities.map((data: GROUP_ACTIVITY_SCHEMA, index: number) => {
    return (
      <FeedGroupCardClient
        key={data.activityID}
        index={index}
        toggleView={() => toggleView(index)}
        show
        memberID={memberID}
        activityData={data}
      />
    );
  });
}
