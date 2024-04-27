import {
  DateToTimestamp,
  TimestampToDateString,
} from "@/src/utils/getCurrentDate";
import { STATUS_SCHEMA } from "@/src/utils/schemas/statuses";
import React from "react";

export default function StatusDetails({
  statusData,
}: {
  statusData: STATUS_SCHEMA;
}) {
  const {
    endDate: tempEndTimestamp,
    startDate: tempStartTimestamp,
    statusTitle,
    statusDesc,
    endorsed,
  } = statusData;

  const tempEndDate = new Date(tempEndTimestamp.seconds * 1000);
  tempEndDate.setHours(tempEndDate.getHours() - 8);
  const endDate = DateToTimestamp(tempEndDate);

  const tempStartDate = new Date(tempStartTimestamp.seconds * 1000);
  tempStartDate.setHours(tempStartDate.getHours() - 8);
  const startDate = DateToTimestamp(tempStartDate);

  return (
    <>
      <div className="flex items-start justify-center flex-col gap-2 flex-[2]">
        <div className="flex flex-col items-start justify-center">
          <h3 className="text-custom-dark-text text-xs">{statusDesc}</h3>
          <h1 className="text-sm text-custom-dark-text font-semibold">
            {statusTitle}
          </h1>
          <p className="text-custom-grey-text text-xs">
            Start Date: {TimestampToDateString(startDate).split(" ")[0]}
          </p>
          <p className="text-custom-grey-text text-xs">
            End Date: {TimestampToDateString(endDate).split(" ")[0]}
          </p>
        </div>
      </div>
      {endorsed.status ? (
        <p className="font-semibold text-custom-orange text-center text-xs">
          Endorsed
        </p>
      ) : (
        <p className="font-semibold text-custom-orange text-center text-xs">
          Pending Review
        </p>
      )}
    </>
  );
}
