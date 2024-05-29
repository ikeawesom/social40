"use client";

import InnerContainer from "@/src/components/utils/InnerContainer";
import { ActiveTimestamp } from "@/src/utils/helpers/getCurrentDate";
import { useState } from "react";
import { twMerge } from "tailwind-merge";
import AddStatusButton from "./AddStatusButton";
import { StatusDetails } from "./StatusDetails";
import { StatusListType } from "../../StatsSection";
import ErrorSection from "@/src/components/utils/ErrorSection";
import DefaultCard from "@/src/components/DefaultCard";

export default function RecentStatusesSection({
  status,
  viewProfile,
}: {
  viewProfile: boolean;
  status: StatusListType;
}) {
  const filteredData = {} as StatusListType;
  Object.keys(status).forEach((id: string) => {
    const now = new Date();
    const { endDate } = status[id];
    const date = new Date(endDate.seconds * 1000);
    if (date < now) filteredData[id] = status[id];
  });

  const empty = Object.keys(filteredData).length === 0;

  return (
    <div
      className={twMerge(
        "flex items-start justify-start flex-col w-full gap-1",
        !viewProfile && "gap-y-1"
      )}
    >
      <h1 className="mb-1 text-start font-semibold text-custom-dark-text">
        Recent Statuses
        {` ( ${Object.keys(filteredData).length} )`}
      </h1>

      {!viewProfile && <AddStatusButton />}

      {empty ? (
        <ErrorSection
          noTitle
          className="bg-white rounded-md"
          errorMsg="Wow looks like a healthy member!"
        />
      ) : (
        Object.keys(filteredData).map((statusID: string) => {
          const curStatus = status[statusID];
          return (
            <DefaultCard key={statusID} className="w-full p-0 overflow-hidden">
              <StatusDetails
                active={ActiveTimestamp(curStatus.endDate)}
                curStatus={curStatus}
                key={curStatus.statusID}
              />
            </DefaultCard>
          );
        })
      )}
    </div>
  );
}
