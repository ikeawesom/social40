import fetchUserDataClient from "@/src/utils/fetchUserDataClient";
import { ACTIVITY_SCHEMA } from "@/src/utils/schemas/member";
import React from "react";

export default function ActivityFeed({
  activities,
}: {
  activities: ACTIVITY_SCHEMA[];
}) {
  const data = fetchUserDataClient();

  return <div className="grid grid-cols-1 gap-y-4"></div>;
}
