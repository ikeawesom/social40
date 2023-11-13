"use client";
import { TimestampToDateString } from "@/src/utils/getCurrentDate";
import { STATUS_SCHEMA } from "@/src/utils/schemas/statuses";
import Link from "next/link";
import React from "react";
import { twMerge } from "tailwind-merge";

type StatusDetailType = {
  active?: boolean;
  curStatus: STATUS_SCHEMA;
};
export function StatusDetails({ active, curStatus }: StatusDetailType) {
  const statusID = curStatus.statusID;
  const route = `/members/${curStatus.memberID}/${curStatus.statusID}`;
  return (
    <Link
      href={route}
      className={twMerge(
        "w-full flex items-start justify-center p-3 flex-col gap-2 hover:brightness-95 duration-200",
        active ? "bg-custom-light-red" : ""
      )}
      key={statusID}
    >
      <div className="flex flex-col items-start justify-center">
        <p className="text-xs text-custom-grey-text">{curStatus.doctor}</p>
        <h1 className="text-custom-dark-text font-semibold">
          {curStatus.statusTitle}
        </h1>
        <h3 className="text-sm text-custom-dark-text">
          {curStatus.statusDesc}
        </h3>
        <p className="text-custom-grey-text text-xs">
          Start Date: {TimestampToDateString(curStatus.startDate).split(" ")[0]}
        </p>
        <p className="text-custom-grey-text text-xs">
          End Date: {TimestampToDateString(curStatus.endDate).split(" ")[0]}
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
