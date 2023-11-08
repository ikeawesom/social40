import React from "react";
import DefaultCard from "../../DefaultCard";
import HRow from "../../utils/HRow";
import { STATUS_SCHEMA } from "@/src/utils/schemas/statuses";
import InnerContainer from "../../utils/InnerContainer";
import MemberStatusTab from "./MemberStatusTab";
import { ActiveTimestamp } from "@/src/utils/getCurrentDate";

export type GroupStatusType = {
  [memberID: string]: { [statusID: string]: STATUS_SCHEMA };
};

export default function GroupStatusSection({
  GroupStatusList,
  adminID,
}: {
  GroupStatusList: GroupStatusType;
  adminID: string;
}) {
  var empty = true;

  const keys = Object.keys(GroupStatusList);

  for (var i = 0; i < keys.length; i++) {
    const length = Object.keys(GroupStatusList[keys[i]]).length;
    if (length !== 0) {
      empty = false;
      break;
    }
  }

  return (
    <DefaultCard className="w-full flex flex-col items-start justify-start gap-2 max-h-[80vh]">
      <div className="w-full">
        <h1 className="text-custom-dark-text font-semibold flex gap-1 items-center justify-start text-start">
          Group Statuses
        </h1>
        <HRow className="mb-0" />
      </div>
      {empty ? (
        <p className="text-sm text-custom-grey-text">
          Looks like nobody in this groups have statuses recorded.
        </p>
      ) : (
        <InnerContainer className="max-h-[80vh]">
          {Object.keys(GroupStatusList).map((memberID: string) => {
            const memberStatus = GroupStatusList[memberID];
            const memberEmpty = Object.keys(memberStatus).length === 0;
            if (!memberEmpty)
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
                        active={active}
                        adminID={adminID}
                        memberID={memberID}
                        statusData={statusData}
                      />
                    );
                  })}
                </div>
              );
          })}
        </InnerContainer>
      )}
    </DefaultCard>
  );
}
