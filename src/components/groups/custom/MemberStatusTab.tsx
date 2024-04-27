"use client";
import { STATUS_SCHEMA } from "@/src/utils/schemas/statuses";
import Link from "next/link";
import React from "react";
import { twMerge } from "tailwind-merge";
import StatusDetails from "./StatusDetails";

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
  const { statusID } = statusData;

  return (
    <Link
      href={`/members/${memberID}/${statusID}`}
      className={twMerge(
        "w-full flex px-3 py-2 max-[320px]:flex-col max-[320px]:items-start items-center max-[320px]:gap-1 gap-2 justify-between hover:bg-custom-light-text duration-200",
        active ? "bg-custom-light-red" : ""
      )}
      key={statusID}
    >
      <StatusDetails statusData={statusData} />
    </Link>
  );
}
