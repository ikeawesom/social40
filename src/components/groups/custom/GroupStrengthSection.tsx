"use client";
import React, { useState } from "react";
import DefaultCard from "../../DefaultCard";
import HRow from "../../utils/HRow";
import { STATUS_SCHEMA } from "@/src/utils/schemas/statuses";
import InnerContainer from "../../utils/InnerContainer";
import MemberStatusTab from "./MemberStatusTab";
import {
  ActiveTimestamp,
  DateToTimestamp,
  TimestampToDate,
} from "@/src/utils/getCurrentDate";
import { twMerge } from "tailwind-merge";
import { GROUP_MEMBERS_SCHEMA } from "@/src/utils/schemas/groups";
import GroupMembers, { GroupDetailsType } from "./GroupMembers";
import { GROUP_ROLES_HEIRARCHY } from "@/src/utils/constants";
import Link from "next/link";
import { Timestamp } from "firebase/firestore";

export type GroupStatusType = {
  [memberID: string]: { [statusID: string]: STATUS_SCHEMA };
};

export function getFixedTimestamp(timestamp: Timestamp) {
  const tempDate = TimestampToDate(timestamp);
  const tempDay = tempDate.getDate() - 1;
  const endDate = new Date(
    tempDay,
    tempDate.getMonth(),
    tempDate.getFullYear(),
    23,
    59,
    59,
    999
  );
  const endTimestamp = DateToTimestamp(endDate);
  return endTimestamp;
}

export default function GroupStrengthSection({
  GroupStatusList,
  adminID,
  curMember,
  groupID,
  membersList,
  admin,
}: {
  GroupStatusList: GroupStatusType;
  adminID: string;
  membersList: GroupDetailsType;
  groupID: string;
  curMember: GROUP_MEMBERS_SCHEMA;
  admin: boolean;
}) {
  const [show, setShow] = useState(false);

  // var empty = true;
  // const keys = Object.keys(GroupStatusList);

  // for (var i = 0; i < keys.length; i++) {
  //   const length = Object.keys(GroupStatusList[keys[i]]).length;
  //   if (length !== 0) {
  //     empty = false;
  //     break;
  //   }
  // }

  const totalStrength = Object.keys(membersList).length;
  const bookedInStrength = Object.keys(membersList)
    .map((id: string) => {
      return membersList[id].bookedIn;
    })
    .filter((state: boolean | undefined) => state === true).length;

  const commandersStrength = Object.keys(membersList).filter(
    (memberID: string) => {
      return (
        GROUP_ROLES_HEIRARCHY[membersList[memberID].role].rank >=
        GROUP_ROLES_HEIRARCHY["admin"].rank
      );
    }
  ).length;

  const mcLength = Object.keys(GroupStatusList).filter((memberID: string) => {
    const statusObjList = GroupStatusList[memberID];
    const mcList = Object.keys(statusObjList).filter((statusID: string) => {
      const { endDate: tempDate } = statusObjList[statusID];
      const endDate = getFixedTimestamp(tempDate);
      return ActiveTimestamp(endDate) && statusObjList[statusID].mc === true;
    });
    return mcList.length > 0;
  }).length;

  const statusLength = Object.keys(GroupStatusList).filter(
    (memberID: string) => {
      const statusObjList = GroupStatusList[memberID];
      const statusList = Object.keys(statusObjList).filter(
        (statusID: string) => {
          const { endDate: tempDate } = statusObjList[statusID];
          const endDate = getFixedTimestamp(tempDate);
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
          const endTimestamp = getFixedTimestamp(endDate);
          const active = ActiveTimestamp(endTimestamp);
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
    <DefaultCard className="w-full flex flex-col items-start justify-start gap-2">
      <h1 className="text-custom-dark-text font-semibold">Strength</h1>

      <h1 className="text-start text-custom-dark-text">
        Booked In:{" "}
        <span className="font-bold">
          {bookedInStrength} / {totalStrength}
        </span>
      </h1>
      <h1 className="text-start text-custom-dark-text">
        Commanders: <span className="font-bold">{commandersStrength}</span>
      </h1>
      <h1 className="text-start text-custom-dark-text">
        Men:{" "}
        <span className="font-bold">{totalStrength - commandersStrength}</span>
      </h1>
      <GroupMembers
        curMember={curMember}
        groupID={groupID}
        membersList={membersList}
      />
      {admin && (
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
                      const memberEmpty =
                        Object.keys(memberStatus).length === 0;
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
                            {Object.keys(memberStatus).map(
                              (statusID: string) => {
                                const statusData = memberStatus[statusID];
                                const active = ActiveTimestamp(
                                  statusData.endDate
                                );
                                if (active)
                                  return (
                                    <MemberStatusTab
                                      key={statusData.statusID}
                                      active={active}
                                      memberID={memberID}
                                      statusData={statusData}
                                    />
                                  );
                              }
                            )}
                          </div>
                        );
                    })
                  )}
                </InnerContainer>
                <Link
                  href={`/groups/${groupID}/statuses`}
                  className="text-sm underline text-custom-grey-text self-end hover:text-custom-primary duration-150"
                >
                  View all statuses
                </Link>
              </>
            )}
          </div>
        </>
      )}
    </DefaultCard>
  );
}
