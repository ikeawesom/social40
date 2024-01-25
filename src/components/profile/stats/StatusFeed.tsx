import React from "react";
import InnerContainer from "../../utils/InnerContainer";
import AddStatusButton from "./status/AddStatusButton";
import { StatusDetails } from "./status/StatusDetails";
import { ActiveTimestamp } from "@/src/utils/getCurrentDate";
import { GetPostObj } from "@/src/utils/API/GetPostObj";
import { StatusListType } from "../StatsSection";
import { twMerge } from "tailwind-merge";

export default async function StatusFeed({
  viewProfile,
  memberID,
}: {
  viewProfile?: boolean;
  memberID: string;
}) {
  const host = process.env.HOST;
  // fetch statuses from member
  const PostObjA = GetPostObj({
    memberID,
  });
  const resB = await fetch(`${host}/api/profile/status`, PostObjA);
  const dataB = await resB.json();

  if (!dataB.status) throw new Error(dataB.error);

  const status = dataB.data as StatusListType;
  const empty = Object.keys(status).length === 0;

  return (
    <div
      className={twMerge(
        "flex flex-col items-start justify-start w-full",
        !viewProfile && "gap-y-1"
      )}
    >
      <h1 className="text-start font-semibold text-custom-dark-text">
        Statuses
      </h1>
      {!viewProfile && <AddStatusButton />}

      <InnerContainer
        className={twMerge(
          "max-h-[60vh] min-h-[10vh]",
          empty && "grid place-items-center justify-center overflow-hidden p-4",
          viewProfile && "my-2"
        )}
      >
        {empty ? (
          <p className="text-start text-custom-grey-text text-sm">
            No status information recorded for this account.
          </p>
        ) : (
          Object.keys(status).map((statusID: string) => {
            const curStatus = status[statusID];
            return (
              <StatusDetails
                active={ActiveTimestamp(curStatus.endDate)}
                curStatus={curStatus}
                key={curStatus.statusID}
              />
            );
          })
        )}
      </InnerContainer>
    </div>
  );
}
