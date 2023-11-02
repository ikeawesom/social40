import { STATUS_SCHEMA } from "@/src/utils/schemas/statuses";
import React from "react";
import InnerContainer from "../../utils/InnerContainer";
import AddStatusButton from "./status/AddStatusButton";
import { twMerge } from "tailwind-merge";
import { getActiveStatus } from "@/src/utils/getActiveStatus";
import HRow from "../../utils/HRow";

export default function StatusFeed({
  status,
  viewProfile,
}: {
  status: { [statusID: string]: STATUS_SCHEMA };
  viewProfile?: boolean;
}) {
  const empty = Object.keys(status).length === 0;

  return (
    <div className="flex flex-col items-start justify-start gap-y-1 w-full">
      <h1 className="text-start font-semibold text-base">Statuses</h1>
      <HRow className="mb-2" />
      {!viewProfile && <AddStatusButton />}
      {!empty ? (
        <InnerContainer className="max-h-[100vh]">
          {Object.keys(status).map((statusID: string) => {
            const curStatus = status[statusID];
            const active = getActiveStatus(curStatus.endDate);

            if (active)
              return (
                <StatusDetails
                  active
                  curStatus={curStatus}
                  key={curStatus.statusID}
                />
              );
          })}
          {Object.keys(status).map((statusID: string) => {
            const curStatus = status[statusID];
            const active = getActiveStatus(curStatus.endDate);
            if (!active)
              return (
                <StatusDetails curStatus={curStatus} key={curStatus.statusID} />
              );
          })}
        </InnerContainer>
      ) : (
        <p className="text-start text-custom-grey-text text-xs">
          No status information recorded for this account.
        </p>
      )}
    </div>
  );
}

type StatusDetailType = {
  active?: boolean;
  curStatus: STATUS_SCHEMA;
};
export function StatusDetails({ active, curStatus }: StatusDetailType) {
  const statusID = curStatus.statusID;
  return (
    <div
      className={twMerge(
        "w-full flex items-start justify-center p-3 flex-col gap-2 hover:bg-custom-light-text duration-200",
        active ? "bg-custom-light-red" : ""
      )}
      key={statusID}
    >
      <div className="flex flex-col items-start justify-center">
        <p className="text-xs text-custom-grey-text">{curStatus.doctor}</p>
        <h1 className="text-custom-dark-text font-semibold">
          {curStatus.statusTitle}
        </h1>
        <h3 className="text-sm text-custom-dark-text">
          {curStatus.statusDesc}
        </h3>
        <p className="text-custom-grey-text text-xs">
          Start Date: {curStatus.startDate.split(" ")[0]}
        </p>
        <p className="text-custom-grey-text text-xs">
          End Date: {curStatus.endDate.split(" ")[0]}
        </p>
      </div>
      {!curStatus.endorsed.status && (
        <p className="text-custom-orange font-bold text-sm text-center">
          Pending Endorsement
        </p>
      )}
    </div>
  );
}
