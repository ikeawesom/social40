import DefaultCard from "@/src/components/DefaultCard";
import InnerContainer from "@/src/components/utils/InnerContainer";
import { GetPostObj } from "@/src/utils/API/GetPostObj";
import ErrorScreenHandler from "@/src/utils/ErrorScreenHandler";
import { TimestampToDateString } from "@/src/utils/getCurrentDate";
import { REMARKS_SCHEMA } from "@/src/utils/schemas/group-activities";
import Link from "next/link";
import React from "react";

export default async function ActivityRemarks({
  activityID,
  groupID,
}: {
  activityID: string;
  groupID: string;
}) {
  try {
    const host = process.env.HOST;
    const ActivityObj = GetPostObj({ activityID });
    const res = await fetch(
      `${host}/api/activity/group-get-remarks`,
      ActivityObj
    );
    const body = await res.json();

    if (!body.status) throw new Error(body.error);

    const remarksData = body.data as { [remarkID: string]: REMARKS_SCHEMA };
    return (
      <DefaultCard className="w-full flex flex-col items-start justify-center gap-2">
        <h1 className="text-custom-dark-text font-semibold">
          Remarks ( {Object.keys(remarksData).length} )
        </h1>
        <InnerContainer className="w-full max-h-[100vh]">
          {Object.keys(remarksData).map((remarkID: string) => {
            const data = remarksData[remarkID];
            const { createdOn, memberID, remarkTitle, activityID } = data;
            return (
              <Link
                key={remarkID}
                href={`/groups/${groupID}/activity?${new URLSearchParams({
                  id: activityID,
                })}&${new URLSearchParams({
                  remarkid: remarkID,
                })}`}
                className="w-full flex flex-col items-start justify-center py-2 px-3 duration-200 hover:bg-custom-light-text"
              >
                <h1 className="font-semibold text-custom-dark-text">
                  {remarkTitle}
                </h1>
                <p className="text-custom-grey-text text-sm">{memberID}</p>
                <p className="text-custom-grey-text text-xs">
                  Date Submitted: {TimestampToDateString(createdOn)}
                </p>
              </Link>
            );
          })}
        </InnerContainer>
      </DefaultCard>
    );
  } catch (err: any) {
    return ErrorScreenHandler(err);
  }
}
