"use client";
import Link from "next/link";
import React, { useState } from "react";
import { twMerge } from "tailwind-merge";
import { useSearchParams } from "next/navigation";

export default function GroupsScrollSection({
  groupsList,
}: {
  groupsList: string[];
}) {
  const searchParams = useSearchParams();
  const paramID = searchParams.get("groupID");
  const [curGroup, setCurGroup] = useState(paramID);

  return (
    <div className="w-full">
      <h1 className="text-xs text-custom-grey-text pl-2">Your groups</h1>
      <div className="flex items-center justify-start gap-x-4 overflow-x-scroll py-2 pr-6 pl-2 w-full">
        {groupsList.map((groupID: string) => {
          return (
            <Link
              scroll={false}
              key={groupID}
              href={`/home?${new URLSearchParams({
                activity: "groups",
                groupID,
              })}`}
              onClick={() => setCurGroup(groupID)}
              className={twMerge(
                "self-stretch w-fit rounded-lg px-2 py-1 flex text-sm items-center justify-center text-center bg-white text-custom-dark-text shadow-md duration-150",
                curGroup === groupID
                  ? "bg-custom-primary text-custom-light-text hover:brightness-105"
                  : "hover:bg-custom-light-text"
              )}
            >
              {groupID}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
