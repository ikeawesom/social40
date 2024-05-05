"use client";
import React, { useState } from "react";
import { twMerge } from "tailwind-merge";
import GroupActivityTab from "../../groups/custom/activities/settings/GroupActivityTab";
import InnerContainer from "../../utils/InnerContainer";
import { GROUP_ACTIVITY_SCHEMA } from "@/src/utils/schemas/group-activities";
import useQueryObj from "@/src/hooks/useQueryObj";
import QueryInput from "../../utils/QueryInput";

export default function JoinedActivitiesList({
  activitiesData,
}: {
  activitiesData: {
    [activityID: string]: GROUP_ACTIVITY_SCHEMA;
  };
}) {
  const [showAll, setShowAll] = useState(false);

  const { handleSearch, itemList, search } = useQueryObj({
    obj: activitiesData,
    type: "activityTitle",
  });

  const activityListID = Object.keys(itemList).filter((id: string) => {
    const now = new Date();
    const { activityDate } = activitiesData[id];
    const date = new Date(activityDate.seconds * 1000);
    date.setHours(date.getHours() + 8);
    return !showAll ? date >= now : true;
  });

  const filteredData = {} as {
    [activityID: string]: GROUP_ACTIVITY_SCHEMA;
  };

  activityListID.forEach((id: string) => {
    filteredData[id] = activitiesData[id];
  });

  const empty = Object.keys(filteredData).length === 0;

  return (
    <>
      <div className="flex items-center justify-between gap-2 w-full mb-2">
        <h1 className="text-custom-dark-text font-semibold">
          {!showAll ? "Upcoming Activities" : "Activities Participated"} ({" "}
          {Object.keys(filteredData).length} )
        </h1>
        <p
          onClick={() => setShowAll(!showAll)}
          className="text-end cursor-pointer underline text-sm text-custom-grey-text hover:text-custom-primary"
        >
          {!showAll ? "Show All" : "Hide"}
        </p>
      </div>

      <QueryInput
        handleSearch={handleSearch}
        placeholder="Search for activity name"
        search={search}
      />

      <InnerContainer
        className={twMerge(
          "min-h-[5vh] my-2 max-h-[60vh]",
          empty && "grid place-items-center justify-center overflow-hidden p-4"
        )}
      >
        {empty ? (
          <p className="text-sm text-custom-grey-text text-center">
            {search === "" ? "Hmm, nothing here..." : "No activities found..."}
          </p>
        ) : (
          Object.keys(filteredData).map((activityID: string) => {
            const activityData = itemList[activityID];
            return (
              <GroupActivityTab activityData={activityData} key={activityID} />
            );
          })
        )}
      </InnerContainer>
    </>
  );
}
// Pause HA calculation
// {HA.data && (
//   <div className="w-full my-2">
//     {HA.status ? (
//       <>
//         <Notice
//           noHeader
//           status="success"
//           text={`This member is currently Heat Acclimatised (HA).`}
//         />
//         <Notice
//           containerClassName="mt-2"
//           status="success"
//           noHeader
//           text={`COMMENTS: ${HA.data}`}
//         />
//       </>
//     ) : (
//       <>
//         <Notice
//           status="warning"
//           text={`This member is currently not Heat Acclimatised (HA).`}
//         />
//         <Notice
//           status="warning"
//           containerClassName="mt-2"
//           text={`${HA.data}`}
//         />
//       </>
//     )}
//   </div>
// )}
