"use client";
import InnerContainer from "@/src/components/utils/InnerContainer";
import QueryInput from "@/src/components/utils/QueryInput";
import useQueryObj from "@/src/hooks/useQueryObj";
import { TimestampToDateString } from "@/src/utils/getCurrentDate";
import Link from "next/link";
import React from "react";

export default function ActivityParticipantsList({
  participantsData,
}: {
  participantsData: any;
}) {
  const { handleSearch, itemList, search } = useQueryObj({
    obj: participantsData,
  });
  return (
    <>
      <h1 className="text-custom-dark-text font-semibold">
        Participants ( {Object.keys(itemList).length} )
      </h1>
      <QueryInput
        handleSearch={handleSearch}
        placeholder="Search for Member ID"
        search={search}
      />
      <InnerContainer className="w-full">
        {Object.keys(itemList).map((memberID: string) => {
          const date = itemList[memberID].dateJoined;
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
      </InnerContainer>{" "}
    </>
  );
}
