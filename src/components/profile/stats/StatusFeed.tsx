import { STATUS_SCHEMA } from "@/src/utils/schemas/statuses";
import React from "react";
import InnerContainer from "../../utils/InnerContainer";
import AddStatusButton from "./status/AddStatusButton";
import { getActiveStatus } from "@/src/utils/getActiveStatus";
import { StatusDetails } from "./status/StatusDetails";
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
