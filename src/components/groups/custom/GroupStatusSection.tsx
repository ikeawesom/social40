import React from "react";
import DefaultCard from "../../DefaultCard";
import HRow from "../../utils/HRow";
import { STATUS_SCHEMA } from "@/src/utils/schemas/statuses";
import InnerContainer from "../../utils/InnerContainer";
import { twMerge } from "tailwind-merge";
import EndorseStatus from "../../status/EndorseStatus";
import Link from "next/link";
import { getActiveStatus } from "@/src/utils/getActiveStatus";

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
                  const {
                    endDate,
                    startDate,
                    statusTitle,
                    statusDesc,
                    endorsed,
                  } = statusData;

                  const active = getActiveStatus(endDate);
                  return (
                    <Link
                      href={`/members/${memberID}/${statusID}`}
                      className={twMerge(
                        "w-full py-2 px-4 flex items-center gap-2 justify-between hover:bg-custom-light-text duration-200",
                        active ? "bg-custom-light-red" : ""
                      )}
                      key={statusID}
                    >
                      <div className="flex items-start justify-center flex-col gap-2 flex-[2]">
                        <div className="flex flex-col items-start justify-center">
                          <h3 className="text-custom-dark-text text-sm">
                            {statusDesc}
                          </h3>
                          <h1 className="text text-custom-dark-text font-semibold">
                            {statusTitle}
                          </h1>
                          <p className="text-custom-grey-text text-xs">
                            Start Date: {startDate.split(" ")[0]}
                          </p>
                          <p className="text-custom-grey-text text-xs">
                            End Date: {endDate.split(" ")[0]}
                          </p>
                        </div>
                      </div>
                      <EndorseStatus
                        statusID={statusID}
                        adminID={adminID}
                        memberID={memberID}
                        status={endorsed.status}
                      />
                    </Link>
                  );
                })}
              </div>
            );
        })}
      </InnerContainer>
    </DefaultCard>
  );
}
