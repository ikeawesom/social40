import React from "react";
import DefaultCard from "../../DefaultCard";
import HRow from "../../utils/HRow";
import { STATUS_SCHEMA } from "@/src/utils/schemas/statuses";
import InnerContainer from "../../utils/InnerContainer";
import { getActiveStatus } from "@/src/utils/getActiveStatus";
import MemberStatusTab from "./MemberStatusTab";

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
  return (
    <DefaultCard className="w-full flex flex-col items-start justify-start gap-2 max-h-[80vh]">
      <div className="w-full">
        <h1 className="text-custom-dark-text font-semibold flex gap-1 items-center justify-start text-start">
          Group Statuses
        </h1>
        <HRow />
      </div>
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
                <h1 className="p-2 font-semibold">{memberID}</h1>
                <HRow className="my-0" />
                {Object.keys(memberStatus).map((statusID: string) => {
                  const statusData = memberStatus[statusID];
                  const active = getActiveStatus(statusData.endDate);

                  if (active)
                    return (
                      <MemberStatusTab
                        active={active}
                        adminID={adminID}
                        memberID={memberID}
                        statusData={statusData}
                      />
                    );
                })}
                {Object.keys(memberStatus).map((statusID: string) => {
                  const statusData = memberStatus[statusID];

                  const active = getActiveStatus(statusData.endDate);
                  if (!active)
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
    </DefaultCard>
  );
}
