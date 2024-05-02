"use client";
import {
  DateToTimestamp,
  TimestampToDateString,
} from "@/src/utils/getCurrentDate";
import { STATUS_SCHEMA } from "@/src/utils/schemas/statuses";
import Link from "next/link";
import React from "react";
import { twMerge } from "tailwind-merge";

type StatusDetailType = {
  active?: boolean;
  curStatus: STATUS_SCHEMA;
};

export function StatusDetails({ active, curStatus }: StatusDetailType) {
  const {
    statusID,
    endDate: tempEndTimestamp,
    startDate: tempStartTimestamp,
  } = curStatus;
  const route = `/members/${curStatus.memberID}/${curStatus.statusID}`;

  const tempEndDate = new Date(tempEndTimestamp.seconds * 1000);
  tempEndDate.setHours(tempEndDate.getHours() - 8);
  const endDate = DateToTimestamp(tempEndDate);

  const tempStartDate = new Date(tempStartTimestamp.seconds * 1000);
  tempStartDate.setHours(tempStartDate.getHours() - 8);
  const startDate = DateToTimestamp(tempStartDate);

  return (
    <Link
      href={route}
      className={twMerge(
        "w-full flex items-start justify-center px-3 py-2 flex-col gap-1 hover:brightness-95 duration-150",
        active ? "bg-custom-light-red" : "hover:bg-custom-light-text"
      )}
      key={statusID}
    >
      <div className="flex flex-col items-start justify-center">
        {/* <p className="text-xs text-custom-grey-text">{curStatus.doctor}</p> */}
        <h1 className="text-custom-dark-text font-semibold">
          {curStatus.statusTitle}
        </h1>
        <h3 className="text-sm text-custom-dark-text">
          {curStatus.statusDesc}
        </h3>
        <p className="text-custom-grey-text text-xs mt-1">
          {TimestampToDateString(startDate).split(" ")[0]} to{" "}
          {TimestampToDateString(endDate).split(" ")[0]}
        </p>
      </div>
      {!curStatus.endorsed.status && (
        <p className="text-custom-orange font-bold text-sm text-center">
          Pending Endorsement
        </p>
      )}
    </Link>
  );
}
