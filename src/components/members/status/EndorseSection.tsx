"use client";
import React from "react";
import DefaultCard from "../../DefaultCard";
import { STATUS_SCHEMA } from "@/src/utils/schemas/statuses";
import EndorseStatus from "../../status/EndorseStatus";
import { useRouter } from "next/navigation";

export default function EndorseSection({
  statusData,
  adminID,
  memberID,
}: {
  statusData: STATUS_SCHEMA;
  adminID: string;
  memberID: string;
}) {
  const router = useRouter();
  return (
    <DefaultCard className="flex flex-col w-full items-start justify-center gap-1">
      <div className="flex items-center justify-start gap-1">
        <p>Endorsment: </p>
        {statusData.endorsed.status ? (
          <h4 className="font-bold text-custom-green">ENDORSED</h4>
        ) : (
          <h4 className="font-semibold text-custom-orange">PENDING</h4>
        )}
      </div>
      {statusData.endorsed.status && (
        <>
          <p>Endorsed by: {statusData.endorsed.endorsedBy}</p>
          <p>Endorsed on: {statusData.endorsed.endorsedOn}</p>
        </>
      )}
      {!statusData.endorsed.status && (
        <EndorseStatus
          router={router}
          className="w-full"
          adminID={adminID}
          memberID={memberID}
          status={statusData.endorsed.status}
          statusID={statusData.statusID}
        />
      )}
    </DefaultCard>
  );
}
