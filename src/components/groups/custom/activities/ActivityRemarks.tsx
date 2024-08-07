import DefaultCard from "@/src/components/DefaultCard";
import InnerContainer from "@/src/components/utils/InnerContainer";
import { GetPostObj } from "@/src/utils/API/GetPostObj";
import ErrorScreenHandler from "@/src/components/ErrorScreenHandler";
import { TimestampToDateString } from "@/src/utils/helpers/getCurrentDate";
import { REMARKS_SCHEMA } from "@/src/utils/schemas/group-activities";
import Link from "next/link";
import React from "react";
import { twMerge } from "tailwind-merge";

function GetUnread(remarksData: { [remarkID: string]: REMARKS_SCHEMA }) {
  let unread = 0;
  Object.keys(remarksData).forEach((remarkID: string) => {
    const { read } = remarksData[remarkID];
    const { status } = read;
    if (!status) unread++;
  });

  return unread;
}

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
    const unread = GetUnread(remarksData);
    const empty = Object.keys(remarksData).length === 0;

    return (
      <DefaultCard className="w-full flex flex-col items-start justify-center gap-2">
        <div className="flex w-full items-center justify-between">
          <h1 className="text-custom-dark-text font-semibold">
            Remarks ( {Object.keys(remarksData).length} )
          </h1>
          <p
            className={twMerge(
              "text-xs",
              unread > 0
                ? "py-1 px-3 bg-custom-red rounded-lg text-custom-light-text"
                : "text-custom-grey-text"
            )}
          >
            {unread} unread
          </p>
        </div>

        <InnerContainer
          className={twMerge(
            "w-full max-h-[60vh]",
            empty &&
              "grid place-items-center justify-center overflow-hidden p-4"
          )}
        >
          {empty ? (
            <p className="text-sm text-custom-grey-text text-center">
              No remarks recorded by participants for now!
            </p>
          ) : (
            Object.keys(remarksData).map((remarkID: string) => {
              const data = remarksData[remarkID];
              const { createdOn, memberID, remarkTitle, activityID, read } =
                data;
              const { status, readOn } = read;
              return (
                <Link
                  scroll={false}
                  key={remarkID}
                  href={`/groups/${groupID}/activity?${new URLSearchParams({
                    id: activityID,
                  })}&${new URLSearchParams({
                    remarkid: remarkID,
                  })}`}
                  className={twMerge(
                    "w-full flex flex-col items-start justify-center py-2 px-3 duration-150 ",
                    !status
                      ? "bg-custom-light-red hover:brightness-95"
                      : "hover:bg-custom-light-text"
                  )}
                >
                  <h1 className="text-custom-dark-text font-semibold">
                    {remarkTitle}
                  </h1>
                  <p className="text-custom-grey-text text-sm">{memberID}</p>
                  <p className="text-custom-grey-text text-xs">
                    Date submitted: {TimestampToDateString(createdOn)}
                  </p>
                  {status && (
                    <p className="text-custom-grey-text text-xs">
                      Read on: {TimestampToDateString(readOn)}
                    </p>
                  )}
                </Link>
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
