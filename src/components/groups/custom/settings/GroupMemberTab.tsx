import { GROUP_MEMBERS_SCHEMA } from "@/src/utils/schemas/groups";
import React from "react";
import { twMerge } from "tailwind-merge";

export default function GroupMemberTab({
  data,
  onClick,
  className,
}: {
  onClick: () => void;
  data: GROUP_MEMBERS_SCHEMA;
  className?: string;
}) {
  return (
    <div
      onClick={onClick}
      className={twMerge(
        "flex flex-col items-start justify-start w-full p-2 cursor-pointer duration-150 ",
        className
      )}
    >
      <div className="flex flex-col items-start justify-start">
        <h1 className="text-xs text-custom-grey-text">{data.memberID}</h1>
        <h1 className="text-sm text-custom-dark-text font-semibold">
          {data.displayName}
        </h1>
      </div>
    </div>
  );
}
