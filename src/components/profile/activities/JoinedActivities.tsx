import React from "react";
import DefaultCard from "../../DefaultCard";
import { GetPostObj } from "@/src/utils/API/GetPostObj";
import ErrorScreenHandler from "@/src/utils/ErrorScreenHandler";
import InnerContainer from "../../utils/InnerContainer";
import { GROUP_ACTIVITY_SCHEMA } from "@/src/utils/schemas/group-activities";
import { twMerge } from "tailwind-merge";
import GroupActivityTab from "../../groups/custom/activities/GroupActivityTab";

export default async function JoinedActivities({
  clickedMemberID,
}: {
  clickedMemberID: string;
}) {
  try {
    const host = process.env.HOST;
    const MemberPost = GetPostObj({ memberID: clickedMemberID });
    const res = await fetch(`${host}/api/profile/group-activities`, MemberPost);
    const body = await res.json();

    if (!body.status) throw new Error(body.error);

    const activitiesData = body.data as {
      [activityID: string]: GROUP_ACTIVITY_SCHEMA;
    };

    const empty = Object.keys(activitiesData).length === 0;
    return (
      <DefaultCard className="w-full">
        <h1 className="text-custom-dark-text font-semibold">
          Group Activities Participated
        </h1>
        <InnerContainer
          className={twMerge(
            "min-h-[5vh] my-2",
            empty && "grid place-items-center justify-center overflow-hidden"
          )}
        >
          {empty ? (
            <p className="text-sm text-custom-grey-text text-center">
              Hmm, this member has not participated in any group activities...
            </p>
          ) : (
            Object.keys(activitiesData).map((activityID: string) => {
              const activityData = activitiesData[activityID];
              return (
                <GroupActivityTab
                  activityData={activityData}
                  key={activityID}
                />
              );
            })
          )}
        </InnerContainer>
      </DefaultCard>
    );
  } catch (err: any) {
    return ErrorScreenHandler(err);
  }
}
