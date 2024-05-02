"use client";

import InnerContainer from "@/src/components/utils/InnerContainer";
import { ActiveTimestamp } from "@/src/utils/getCurrentDate";
import { useState } from "react";
import { twMerge } from "tailwind-merge";
import AddStatusButton from "./AddStatusButton";
import { StatusDetails } from "./StatusDetails";
import { StatusListType } from "../../StatsSection";

export default function StatusList({
  status,
  viewProfile,
}: {
  viewProfile: boolean;
  status: StatusListType;
}) {
  const [showAll, setShowAll] = useState(false);

  const filteredStatusIDs = Object.keys(status).filter((id: string) => {
    const now = new Date();
    const { endDate } = status[id];
    const date = new Date(endDate.seconds * 1000);
    return showAll ? true : date >= now;
  });

  const filteredData = {} as StatusListType;

  filteredStatusIDs.forEach((id: string) => {
    filteredData[id] = status[id];
  });

  const empty = Object.keys(filteredData).length === 0;

  return (
    <div
      className={twMerge(
        "flex flex-col items-start justify-start w-full",
        !viewProfile && "gap-y-1"
      )}
    >
      <div className="w-full flex items-center justify-between gap-2">
        <h1 className="text-start font-semibold text-custom-dark-text">
          {showAll ? "All Statuses" : "Active Statuses"}{" "}
          {`( ${Object.keys(filteredData).length} )`}
        </h1>
        <p
          onClick={() => setShowAll(!showAll)}
          className="text-end cursor-pointer underline text-sm text-custom-grey-text hover:text-custom-primary"
        >
          {!showAll ? "Show All" : "Hide"}
        </p>
      </div>
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
          Object.keys(filteredData).map((statusID: string) => {
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
