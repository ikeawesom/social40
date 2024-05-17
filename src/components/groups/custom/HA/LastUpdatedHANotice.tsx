import Notice from "@/src/components/utils/Notice";
import { TimestampToDateString } from "@/src/utils/helpers/getCurrentDate";
import React from "react";
import { twMerge } from "tailwind-merge";
import LastUpdatedHAQuestion from "./LastUpdatedHAQuestion";
import { Timestamp } from "firebase/firestore";

export default async function LastUpdatedHANotice({
  lastUpdatedHA,
  textClassName,
  containerClassName,
  inMember,
}: {
  lastUpdatedHA: Timestamp;
  textClassName?: string;
  containerClassName?: string;
  inMember?: string;
}) {
  return (
    <Notice
      status="info"
      noHeader
      textClassName={twMerge(
        "flex items-center justify-between gap-4",
        textClassName
      )}
      containerClassName={twMerge(containerClassName)}
    >
      <p className="text-start">
        {inMember ? (
          <span className="font-bold">{`${inMember}'s`}</span>
        ) : (
          "Individual"
        )}{" "}
        HA was last calculated at:{" "}
        <span className="font-bold">
          {TimestampToDateString(lastUpdatedHA)}
        </span>
      </p>
      <LastUpdatedHAQuestion />
    </Notice>
  );
}
