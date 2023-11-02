import { STATUS_SCHEMA } from "@/src/utils/schemas/statuses";
import React from "react";
import InnerContainer from "../../utils/InnerContainer";
import AddStatusButton from "./status/AddStatusButton";
import { twMerge } from "tailwind-merge";

export default function StatusFeed({
  status,
}: {
  status: { [statusID: string]: STATUS_SCHEMA };
}) {
  const empty = Object.keys(status).length === 0;

  return (
    <div className="flex flex-col items-start justify-start gap-y-1 w-full">
      <h1 className="text-start font-semibold text-base">Statuses</h1>
      <AddStatusButton />
      {!empty ? (
        <InnerContainer className="max-h-[100vh]">
          {Object.keys(status).map((statusID: string) => {
            const curStatus = status[statusID];
            const today = new Date();
            const endDateStr = curStatus.endDate.split(" ")[0];
            const endDateArr = endDateStr.split("/");
            const endDate = new Date(
              Number.parseInt(endDateArr[2]),
              Number.parseInt(endDateArr[1]) - 1,
              Number.parseInt(endDateArr[0]) + 1,
              7,
              59
            );

            const active = today <= endDate;

            return (
              <div
                className={twMerge(
                  "w-full flex items-start justify-center p-3 flex-col gap-2 hover:bg-custom-light-text duration-200",
                  active ? "bg-custom-light-red" : ""
                )}
                key={statusID}
              >
                <div className="flex flex-col items-start justify-center">
                  <p className="text-xs text-custom-grey-text">
                    {curStatus.doctor}
                  </p>
                  <h1 className="text-lg text-custom-dark-text font-semibold">
                    {curStatus.statusTitle}
                  </h1>
                  <h3 className="text-base text-custom-dark-text">
                    {curStatus.statusDesc}
                  </h3>
                  <p className="text-custom-grey-text text-sm">
                    Start Date: {curStatus.startDate.split(" ")[0]}
                  </p>
                  <p className="text-custom-grey-text text-sm">
                    End Date: {curStatus.endDate.split(" ")[0]}
                  </p>
                </div>
                <div className="grid place-items-center w-full text-center">
                  {curStatus.endorsed.status ? (
                    <p className="text-custom-green font-bold text-sm">
                      Endorsed
                    </p>
                  ) : (
                    <p className="text-custom-orange font-bold text-sm">
                      Pending Endorsement
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </InnerContainer>
      ) : (
        <p className="text-start text-custom-grey-text text-xs">
          You have no status information added to your account.
        </p>
      )}
    </div>
  );
}
