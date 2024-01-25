"use client";
import React, { useState } from "react";
import DefaultCard from "../../DefaultCard";
import HRow from "../../utils/HRow";
import { STATUS_SCHEMA } from "@/src/utils/schemas/statuses";
import InnerContainer from "../../utils/InnerContainer";
import MemberStatusTab from "./MemberStatusTab";
import { ActiveTimestamp } from "@/src/utils/getCurrentDate";
import { twMerge } from "tailwind-merge";
import { GROUP_MEMBERS_SCHEMA } from "@/src/utils/schemas/groups";
import GroupMembers, { GroupDetailsType } from "./GroupMembers";
import { GROUP_ROLES_HEIRARCHY } from "@/src/utils/constants";

export type GroupStatusType = {
  [memberID: string]: { [statusID: string]: STATUS_SCHEMA };
};

export default function GroupStrengthSection({
  GroupStatusList,
  adminID,
  curMember,
  groupID,
  membersList,
}: {
  GroupStatusList: GroupStatusType;
  adminID: string;
  membersList: GroupDetailsType;
  groupID: string;
  curMember: GROUP_MEMBERS_SCHEMA;
}) {
  const [show, setShow] = useState(false);
  var empty = true;

  const keys = Object.keys(GroupStatusList);

  for (var i = 0; i < keys.length; i++) {
    const length = Object.keys(GroupStatusList[keys[i]]).length;
    if (length !== 0) {
      empty = false;
      break;
    }
  }

  const totalStrength = Object.keys(membersList).length;
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

  return (
    <DefaultCard className="w-full flex flex-col items-start justify-start gap-2">
      <h1 className="text-custom-dark-text font-semibold">Strength</h1>
      <h1 className="text-start text-custom-dark-text">
        Total: <span className="font-bold">{totalStrength}</span>
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
                  Looks like nobody in this groups have statuses recorded.
                </p>
              ) : (
                Object.keys(GroupStatusList).map((memberID: string) => {
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
          </>
        )}
      </div>
    </DefaultCard>
  );
}
