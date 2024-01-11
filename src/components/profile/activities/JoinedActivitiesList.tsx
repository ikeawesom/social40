"use client";
import React from "react";
import { twMerge } from "tailwind-merge";
import GroupActivityTab from "../../groups/custom/activities/GroupActivityTab";
import InnerContainer from "../../utils/InnerContainer";
import Notice from "../../utils/Notice";
import { handleHA } from "@/src/utils/activities/handleHA";
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
  const { handleSearch, itemList, search } = useQueryObj({
    obj: activitiesData,
    type: "activityTitle",
  });
  const { HA, empty } = handleHA(itemList);

  return (
    <>
      <h1 className="text-custom-dark-text font-semibold mb-2">
        Group Activities Participated ( {Object.keys(itemList).length} )
      </h1>
      <QueryInput
        handleSearch={handleSearch}
        placeholder="Search for activity name"
        search={search}
      />
      {HA.data && (
        <div className="w-full my-2">
          {HA.status ? (
            <>
              <Notice
                noHeader
                status="success"
                text={`This member is currently Heat Acclimatised (HA).`}
              />
              <Notice
                containerClassName="mt-2"
                status="success"
                noHeader
                text={`COMMENTS: ${HA.data}`}
              />
            </>
          ) : (
            <>
              <Notice
                status="warning"
                text={`This member is currently not Heat Acclimatised (HA).`}
              />
              <Notice
                status="warning"
                containerClassName="mt-2"
                text={`${HA.data}`}
              />
            </>
          )}
        </div>
      )}
      <InnerContainer
        className={twMerge(
          "min-h-[5vh] my-2",
          empty && "grid place-items-center justify-center overflow-hidden p-4"
        )}
      >
        {empty ? (
          <p className="text-sm text-custom-grey-text text-center">
            {search === ""
              ? "Hmm, this member has not participated in any group activities..."
              : "No activities found..."}
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
    </>
  );
}
