import DefaultCard from "@/src/components/DefaultCard";
import InnerContainer from "@/src/components/utils/InnerContainer";
import ErrorScreenHandler from "@/src/utils/ErrorScreenHandler";
import { FetchGroupActivityData } from "@/src/utils/activities/group/FetchData";
import { TimestampToDateString } from "@/src/utils/getCurrentDate";
import Link from "next/link";
import React from "react";
import { SuspenseGroupActivityFetchType } from "./GroupActivityData";

export default async function ActivityParticipants({
  groupID,
  activityID,
  memberID,
}: SuspenseGroupActivityFetchType) {
  try {
    const host = process.env.HOST as string;

    const res = await FetchGroupActivityData.getMain({
      activityID,
      groupID,
      host,
      memberID,
    });

    if (!res.status) throw new Error(res.error);

    const { participantsData } = res.data;

    return (
      <DefaultCard className="w-full flex flex-col items-start justify-center gap-2">
        <h1 className="text-custom-dark-text font-semibold">
          Participants ( {Object.keys(participantsData).length} )
        </h1>
        <InnerContainer className="w-full">
          {Object.keys(participantsData).map((memberID: string) => {
            const date = participantsData[memberID].dateJoined;
            const dateStr = TimestampToDateString(date);
            return (
              <Link
                key={memberID}
                href={`/members/${memberID}`}
                className="w-full flex flex-col items-start justify-center py-2 px-3 duration-200 hover:bg-custom-light-text"
              >
                <h1 className="text-custom-dark-text font-semibold">
                  {memberID}
                </h1>
                <h4 className="text-custom-grey-text text-sm">
                  Participated on: {dateStr}
                </h4>
              </Link>
            );
          })}
        </InnerContainer>
      </DefaultCard>
    );
  } catch (err: any) {
    return ErrorScreenHandler(err);
  }
}
