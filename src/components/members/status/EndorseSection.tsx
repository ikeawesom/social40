"use client";
import React from "react";
import DefaultCard from "../../DefaultCard";
import { STATUS_SCHEMA } from "@/src/utils/schemas/statuses";
import EndorseStatus from "../../status/EndorseStatus";
import { useRouter } from "next/navigation";
import {
  DateToString,
  TimestampToDateString,
} from "@/src/utils/getCurrentDate";

export default function EndorseSection({
  statusData,
  adminID,
  memberID,
}: {
  statusData: STATUS_SCHEMA;
  adminID: string;
  memberID: string;
}) {
  const tempDate = new Date(statusData.endorsed.endorsedOn.seconds * 1000);
  const dateStr = DateToString(tempDate);

  const router = useRouter();
  return (
    <DefaultCard className="flex flex-col w-full items-start justify-center gap-1">
      <div className="flex items-center justify-start gap-1">
        <p className="text-custom-dark-text text-sm">Endorsment: </p>
        {statusData.endorsed.status ? (
          <h4 className="font-bold text-custom-green text-sm">ENDORSED</h4>
        ) : (
          <h4 className="font-semibold text-custom-orange text-sm">PENDING</h4>
        )}
      </div>
      {statusData.endorsed.status && (
        <>
          <p className="text-custom-dark-text text-sm">
            Endorsed by: {statusData.endorsed.endorsedBy}
          </p>
          <p className="text-custom-dark-text text-sm">
            Endorsed on: {dateStr}
          </p>
        </>
      )}
      {!statusData.endorsed.status && (
        <EndorseStatus
          router={router}
          className="w-full"
          adminID={adminID}
          memberID={memberID}
          statusID={statusData.statusID}
        />
      )}
    </DefaultCard>
  );
}
