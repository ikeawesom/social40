"use client";
import { STATUS_SCHEMA } from "@/src/utils/schemas/statuses";
import Link from "next/link";
import React from "react";
import { twMerge } from "tailwind-merge";
import { useRouter } from "next/navigation";

type MemberStatusType = {
  adminID: string;
  memberID: string;
  active: boolean;
  statusData: STATUS_SCHEMA;
};

export default function MemberStatusTab({
  adminID,
  memberID,
  active,
  statusData,
}: MemberStatusType) {
  const router = useRouter();
  const { endDate, startDate, statusTitle, statusDesc, endorsed, statusID } =
    statusData;
  return (
    <Link
      href={`/members/${memberID}/${statusID}`}
      className={twMerge(
        "w-full py-2 px-4 flex items-center gap-2 justify-between hover:bg-custom-light-text duration-200",
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
            Start Date: {startDate.split(" ")[0]}
          </p>
          <p className="text-custom-grey-text text-xs">
            End Date: {endDate.split(" ")[0]}
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
