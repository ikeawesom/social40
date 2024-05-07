"use client";
import HRow from "@/src/components/utils/HRow";
import { ActiveTimestamp } from "@/src/utils/getCurrentDate";
import React from "react";
import { twMerge } from "tailwind-merge";
import useQueryObj from "@/src/hooks/useQueryObj";
import QueryInput from "@/src/components/utils/QueryInput";
import StatusDetails from "../StatusDetails";
import Link from "next/link";
import { GroupStatusType } from "@/src/utils/schemas/groups";

export default function FullStatusList({
  groupStatusList,
}: {
  groupStatusList: GroupStatusType;
}) {
  const { handleSearch, itemList, search } = useQueryObj({
    obj: groupStatusList,
  });

  const empty = Object.keys(itemList).length === 0;

  return (
    <>
      <div className="w-full rounded-md bg-white/80 shadow-sm p-4 sticky top-14 left-0 z-20">
        <QueryInput
          className="m-0"
          handleSearch={handleSearch}
          placeholder="Search memberID"
          search={search}
        />
      </div>

      {empty ? (
        <p className="text-sm text-custom-grey-text">Whoops, nothing here.</p>
      ) : (
        Object.keys(itemList).map((memberID: string) => {
          const memberStatus = itemList[memberID];
          const memberEmpty = Object.keys(memberStatus).length === 0;
          if (!memberEmpty)
            return (
              <div
                key={memberID}
                className="w-full flex-col flex items-start justify-center"
              >
                <h1 className="font-semibold text-sm">{memberID}</h1>
                <HRow className="my-2" />
                <div className="w-full flex flex-col items-start justify-start gap-2">
                  {Object.keys(memberStatus).map((statusID: string) => {
                    const statusData = memberStatus[statusID];
                    const active = ActiveTimestamp(statusData.endDate);
                    return (
                      <Link
                        key={statusID}
                        href={`/members/${memberID}/${statusID}`}
                        className={twMerge(
                          "rounded-md w-full flex px-3 py-2 bg-white max-[320px]:flex-col max-[320px]:items-start items-center max-[320px]:gap-1 gap-2 justify-between hover:bg-custom-light-text duration-150",
                          active ? "bg-custom-light-red" : ""
                        )}
                      >
                        <StatusDetails statusData={statusData} />
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
        })
      )}
    </>
  );
}
