import {
  DateToTimestamp,
  TimestampToDateString,
} from "@/src/utils/helpers/getCurrentDate";
import { GROUP_ACTIVITIES_SCHEMA } from "@/src/utils/schemas/groups";
import Link from "next/link";
import React from "react";
import Image from "next/image";
import { useFetchActivityRequests } from "@/src/hooks/groups/activities/useFetchActivityRequests";
import LoadingIcon from "@/src/components/utils/LoadingIcon";

export default function GroupActivityTab({
  activityData,
  showBadge,
}: {
  activityData: GROUP_ACTIVITIES_SCHEMA;
  showBadge?: boolean;
}) {
  const {
    activityDate: tempTimestamp,
    isPT,
    activityID,
    groupID,
  } = activityData;

  const tempDate = new Date(tempTimestamp.seconds * 1000);
  tempDate.setHours(tempDate.getHours() - 8);
  const newDate = DateToTimestamp(tempDate);
  const dateStr = TimestampToDateString(newDate);

  const { requested } = useFetchActivityRequests(activityID, groupID);
  const length = Object.keys(requested ?? {}).length;

  return (
    <Link
      scroll={false}
      href={`/groups/${activityData.groupID}/activity?${new URLSearchParams({
        id: activityData.activityID,
      })}`}
      className="w-full py-2 px-3 flex items-start justify-center flex-col duration-150 hover:bg-custom-light-text"
    >
      <h1 className="text-custom-dark-text font-semibold flex items-center justify-start gap-1">
        {activityData.activityTitle}
        {isPT && (
          <Image
            alt="PT activity"
            className="my-1"
            src="/icons/features/icon_activities_active.svg"
            width={20}
            height={20}
          />
        )}
        {showBadge && requested === undefined ? (
          <LoadingIcon height={10} width={10} />
        ) : (
          length > 0 && (
            <span className="bg-custom-red text-custom-light-text font-medium px-2 rounded-full text-sm text-center my-2">
              {length > 9 ? "9+" : length}
            </span>
          )
        )}
      </h1>
      <h4 className="text-custom-grey-text text-sm">
        {activityData.activityDesc}
      </h4>
      <h4 className="text-custom-grey-text text-sm">{dateStr}</h4>
    </Link>
  );
}
