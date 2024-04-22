"use client";

import useQueryObj from "@/src/hooks/useQueryObj";
import { GROUP_ACTIVITY_SCHEMA } from "@/src/utils/schemas/group-activities";
import AllActivityCard from "./AllActivityCard";
import QueryInput from "@/src/components/utils/QueryInput";

export default function AllActivities({
  activities,
  memberID,
}: {
  activities: {
    [groupID: string]: GROUP_ACTIVITY_SCHEMA;
  };
  memberID: string;
}) {
  const { handleSearch, itemList, search } = useQueryObj({
    obj: activities,
    type: "activityTitle",
  });

  return (
    <div className="flex flex-col items-center justify-start w-full gap-4">
      <div className="w-full rounded-md bg-white/80 shadow-sm p-4 sticky top-14 left-0 z-20">
        <QueryInput
          handleSearch={handleSearch}
          placeholder="Search activity name"
          search={search}
          className="mb-0"
        />
      </div>
      {Object.keys(itemList).map((activityID: string) => {
        const data = itemList[activityID] as GROUP_ACTIVITY_SCHEMA;
        return <AllActivityCard key={activityID} data={data} />;
      })}
    </div>
  );
}
