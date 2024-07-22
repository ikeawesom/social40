"use client";

import useQueryObj from "@/src/hooks/useQueryObj";
import { GROUP_ACTIVITY_SCHEMA } from "@/src/utils/schemas/group-activities";
import AllActivityCard from "./AllActivityCard";
import QueryInput from "@/src/components/utils/QueryInput";
import {
  ActiveTimestamp,
  DateToTimestamp,
} from "@/src/utils/helpers/getCurrentDate";
import SecondaryButton from "@/src/components/utils/SecondaryButton";
import { useState } from "react";

type ActivityType = {
  [groupID: string]: GROUP_ACTIVITY_SCHEMA;
};
export default function AllActivities({
  activities,
  memberID,
}: {
  activities: ActivityType;
  memberID: string;
}) {
  const [status, setStatus] = useState(false);

  const { handleSearch, itemList, search } = useQueryObj({
    obj: activities,
    type: "activityTitle",
  });

  const upcomingObj = {} as ActivityType;
  const finishedObj = {} as ActivityType;

  Object.keys(itemList).filter((id: string) => {
    const { activityDate: tempTimestamp } = itemList[id];
    const tempDate = new Date(tempTimestamp.seconds * 1000);
    const date = DateToTimestamp(tempDate);
    const active = ActiveTimestamp(date);
    if (active) {
      upcomingObj[id] = itemList[id];
    } else {
      finishedObj[id] = itemList[id];
    }
  });

  const filtered = !status ? upcomingObj : finishedObj;
  return (
    <div className="flex flex-col items-center justify-start w-full gap-4">
      <div className="w-full rounded-md bg-white/80 shadow-sm p-4 sticky top-14 left-0 z-20">
        <QueryInput
          handleSearch={handleSearch}
          placeholder="Search activity name"
          search={search}
          className="mb-0"
        />
        <div className="w-full flex items-center justify-between gap-2 mt-3">
          <SecondaryButton onClick={() => setStatus(false)} activated={!status}>
            Upcoming
          </SecondaryButton>
          <SecondaryButton onClick={() => setStatus(true)} activated={status}>
            Finished
          </SecondaryButton>
        </div>
      </div>

      {Object.keys(filtered).map((activityID: string) => {
        const data = itemList[activityID] as GROUP_ACTIVITY_SCHEMA;
        return <AllActivityCard key={activityID} data={data} />;
      })}
    </div>
  );
}
