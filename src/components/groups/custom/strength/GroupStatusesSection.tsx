"use client";

import HRow from "@/src/components/utils/HRow";
import InnerContainer from "@/src/components/utils/InnerContainer";
import { ActiveTimestamp } from "@/src/utils/helpers/getCurrentDate";
import Link from "next/link";
import React, { useState } from "react";
import { twMerge } from "tailwind-merge";
import MemberStatusTab from "../MemberStatusTab";
import { GroupStatusType } from "@/src/utils/schemas/groups";

export default function GroupStatusesSection({
  GroupStatusList,
  groupID,
}: {
  groupID: string;
  GroupStatusList: GroupStatusType;
}) {
  const [show, setShow] = useState(false);

  const mcLength = Object.keys(GroupStatusList).filter((memberID: string) => {
    const statusObjList = GroupStatusList[memberID];
    const mcList = Object.keys(statusObjList).filter((statusID: string) => {
      const { endDate } = statusObjList[statusID];
      return ActiveTimestamp(endDate) && statusObjList[statusID].mc === true;
    });
    return mcList.length > 0;
  }).length;

  const statusLength = Object.keys(GroupStatusList).filter(
    (memberID: string) => {
      const statusObjList = GroupStatusList[memberID];
      const statusList = Object.keys(statusObjList).filter(
        (statusID: string) => {
          const { endDate } = statusObjList[statusID];
          return (
            ActiveTimestamp(endDate) && statusObjList[statusID].mc === false
          );
        }
      );
      return statusList.length > 0;
    }
  ).length;

  const activeStatuses = Object.keys(GroupStatusList).filter(
    (memberID: string) => {
      // check if member has active statuses
      const activeMembers = Object.keys(GroupStatusList[memberID]).map(
        (statusID: string) => {
          const { endDate } = GroupStatusList[memberID][statusID];
          const active = ActiveTimestamp(endDate);
          return active;
        }
      );

      if (activeMembers.length > 0) {
        let flag = false;
        activeMembers.forEach((active: boolean) => {
          if (active) flag = true;
        });
        if (flag) return true;
      }
      return false;
    }
  );

  const empty = activeStatuses.length === 0;

  return (
    <>
      <HRow />
      <h1 className="text-start text-custom-dark-text">
        Statuses: <span className="font-bold">{statusLength}</span>
      </h1>
      <h1 className="text-start text-custom-dark-text">
        MCs: <span className="font-bold">{mcLength}</span>
      </h1>
      <div className="w-full flex flex-col items-start justify-start gap-2 max-h-[80vh]">
        <h1
          onClick={() => setShow(!show)}
          className={twMerge(
            "text-start cursor-pointer underline text-sm duration-150",
            !show ? "text-custom-grey-text" : "text-custom-primary"
          )}
        >
          {show ? "Hide Breakdown" : "View Breakdown"}
        </h1>
        {show && (
          <>
            <InnerContainer
              className={twMerge(
                "min-h-[10vh] max-h-[60vh]",
                empty &&
                  "grid place-items-center justify-center overflow-hidden p-4"
              )}
            >
              {empty ? (
                <p className="text-sm text-custom-grey-text">
                  Great! Looks like nobody in this group currently have
                  statuses.
                </p>
              ) : (
                activeStatuses.map((memberID: string) => {
                  const memberStatus = GroupStatusList[memberID];
                  const memberEmpty = Object.keys(memberStatus).length === 0;
                  if (!memberEmpty)
                    return (
                      <div
                        key={memberID}
                        className="w-full flex-col flex items-start justify-center"
                      >
                        <h1 className="p-2 font-semibold text-sm">
                          {memberID}
                        </h1>
                        <HRow className="my-0" />
                        {Object.keys(memberStatus).map((statusID: string) => {
                          const statusData = memberStatus[statusID];
                          const active = ActiveTimestamp(statusData.endDate);
                          if (active)
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
            <Link
              scroll={false}
              href={`/groups/${groupID}/statuses`}
              className="text-sm underline text-custom-grey-text self-end hover:text-custom-primary duration-150"
            >
              View all statuses
            </Link>
          </>
        )}
      </div>
    </>
  );
}
