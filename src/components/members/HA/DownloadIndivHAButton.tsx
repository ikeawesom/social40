"use client";
import { AllDatesActivitiesType } from "@/src/utils/schemas/ha";
import React from "react";
import LoadingIcon from "../../utils/LoadingIcon";
import SecondaryButton from "../../utils/SecondaryButton";
import Image from "next/image";
import { useDownloadIndivHA } from "@/src/utils/members/useDownloadIndivHA";
import { StringToDate } from "@/src/utils/helpers/getCurrentDate";

export default function DownloadIndivHAButton({
  memberID,
  dailyActivities,
}: {
  memberID: string;
  dailyActivities: AllDatesActivitiesType;
}) {
  const sortedDailyActivitesDates = Object.keys(dailyActivities).sort(
    (a, b) => {
      let aDate = StringToDate(`${a} 00:00`).data as Date;
      const bDate = StringToDate(`${b} 00:00`).data as Date;
      return aDate.getTime() - bDate.getTime();
    }
  );
  let sortedDailyActivities = {} as AllDatesActivitiesType;

  sortedDailyActivitesDates.forEach((dateStr: string) => {
    sortedDailyActivities[dateStr] = dailyActivities[dateStr];
  });

  const { download, loading } = useDownloadIndivHA(
    memberID,
    sortedDailyActivities
  );

  return (
    <SecondaryButton
      disabled={loading}
      className="flex items-center justify-center gap-1"
      onClick={download}
    >
      Download data{" "}
      {loading ? (
        <LoadingIcon height={15} width={15} />
      ) : (
        <Image src="/icons/icon_download.svg" alt="" width={15} height={15} />
      )}
    </SecondaryButton>
  );
}
