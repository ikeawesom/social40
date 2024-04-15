"use client";
import { STATUS_SCHEMA } from "@/src/utils/schemas/statuses";
import Link from "next/link";
import React from "react";
import { twMerge } from "tailwind-merge";
import {
  DateToTimestamp,
  TimestampToDateString,
} from "@/src/utils/getCurrentDate";

type MemberStatusType = {
  memberID: string;
  active: boolean;
  statusData: STATUS_SCHEMA;
};

export default function MemberStatusTab({
  memberID,
  active,
  statusData,
}: MemberStatusType) {
  const {
    endDate: tempEndTimestamp,
    startDate: tempStartTimestamp,
    statusTitle,
    statusDesc,
    endorsed,
    statusID,
  } = statusData;

  const tempEndDate = new Date(tempEndTimestamp.seconds * 1000);
  tempEndDate.setHours(tempEndDate.getHours() - 8);
  const endDate = DateToTimestamp(tempEndDate);

  const tempStartDate = new Date(tempStartTimestamp.seconds * 1000);
  tempStartDate.setHours(tempStartDate.getHours() - 8);
  const startDate = DateToTimestamp(tempStartDate);

  return (
    <Link
      href={`/members/${memberID}/${statusID}`}
      className={twMerge(
        "w-full px-3 py-2 flex max-[320px]:flex-col max-[320px]:items-start items-center max-[320px]:gap-1 gap-2 justify-between hover:bg-custom-light-text duration-200",
        active ? "bg-custom-light-red" : ""
      )}
      key={statusID}
    >
      <div className="flex items-start justify-center flex-col gap-2 flex-[2]">
        <div className="flex flex-col items-start justify-center">
          <h3 className="text-custom-dark-text text-xs">{statusDesc}</h3>
          <h1 className="text-sm text-custom-dark-text font-semibold">
            {statusTitle}
          </h1>
          <p className="text-custom-grey-text text-xs">
            Start Date: {TimestampToDateString(startDate)}
          </p>
          <p className="text-custom-grey-text text-xs">
            End Date: {TimestampToDateString(endDate)}
          </p>
        </div>
      </div>
      {endorsed.status ? (
        <p className="font-semibold text-custom-orange text-center text-xs">
          Endorsed
        </p>
      ) : (
        <p className="font-semibold text-custom-orange text-center text-xs">
          Pending Review
        </p>
      )}
    </Link>
  );
}
