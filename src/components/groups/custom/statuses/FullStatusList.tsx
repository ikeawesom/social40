"use client";
import HRow from "@/src/components/utils/HRow";
import InnerContainer from "@/src/components/utils/InnerContainer";
import { ActiveTimestamp } from "@/src/utils/getCurrentDate";
import React from "react";
import { twMerge } from "tailwind-merge";
import MemberStatusTab from "../MemberStatusTab";
import { GroupStatusType } from "../GroupStrengthSection";
import useQueryObj from "@/src/hooks/useQueryObj";
import QueryInput from "@/src/components/utils/QueryInput";
import DefaultCard from "@/src/components/DefaultCard";

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
      <DefaultCard className="w-full">
        <QueryInput
          className="m-0"
          handleSearch={handleSearch}
          placeholder="Search memberID"
          search={search}
        />
      </DefaultCard>
      <DefaultCard className="w-full">
        <InnerContainer
          className={twMerge(
            "min-h-[40vh] overflow-visible",
            empty &&
              "grid place-items-center justify-center overflow-hidden p-4"
          )}
        >
          {empty ? (
            <p className="text-sm text-custom-grey-text">
              Whoops, nothing here.
            </p>
          ) : (
            Object.keys(itemList).map((memberID: string) => {
              const memberStatus = itemList[memberID];
              const memberEmpty = Object.keys(memberStatus).length === 0;
              return (
                <div
                  key={memberID}
                  className="w-full flex-col flex items-start justify-center"
                >
                  <h1 className="p-2 font-semibold text-sm">{memberID}</h1>
                  <HRow className="my-0" />
                  {Object.keys(memberStatus).map((statusID: string) => {
                    const statusData = memberStatus[statusID];
                    const active = ActiveTimestamp(statusData.endDate);
                    return (
                      <MemberStatusTab
                        key={statusData.statusID}
                        active={active}
                        memberID={memberID}
                        statusData={statusData}
                      />
                    );
                  })}
                </div>
              );
            })
          )}
        </InnerContainer>
      </DefaultCard>
    </>
  );
}
