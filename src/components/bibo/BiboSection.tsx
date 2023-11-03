import React from "react";
import DefaultCard from "../DefaultCard";
import HRow from "../utils/HRow";
import InnerContainer from "../utils/InnerContainer";
import { MEMBER_SCHEMA } from "@/src/utils/schemas/members";
import BookSomeoneButton from "./BookSomeoneButton";

export default function BiboSection({
  memberData,
}: {
  memberData: MEMBER_SCHEMA;
}) {
  const membersBookedIn = memberData.bookedInMembers;

  return (
    <DefaultCard>
      <div className="flex flex-col items-start justify-start gap-y-1 w-full">
        <h1 className="text-start font-semibold text-base">Book in Members</h1>
        <BookSomeoneButton />
        {membersBookedIn && Object.keys(membersBookedIn).length !== 0 ? (
          <InnerContainer className="py-2 gap-4 max-h-[100vh]">
            {Object.keys(membersBookedIn).map((date, index) => {
              const dateObj = membersBookedIn[date];
              return (
                <div
                  key={index}
                  className="flex flex-col w-full items-start justify-center"
                >
                  <div className="flex flex-col items-start justify-center w-full px-3">
                    <h1 className="text-sm text-custom-grey-text text-start">
                      {date}
                    </h1>
                    <HRow />
                  </div>

                  <div className="flex flex-col items-start justify-center gap-2 w-full">
                    {Object.keys(dateObj).map((memberID, indexA) => {
                      const memberObject = dateObj[memberID];
                      const time = memberObject.bookInOn.split(" ")[1];

                      return (
                        <div
                          key={indexA}
                          className="hover:bg-custom-light-text duration-200 w-full py-1 px-3"
                        >
                          <h1 className="text-custom-dark-text">
                            {memberObject.memberID}
                          </h1>
                          <p className="text-sm text-custom-grey-text">
                            Booked In member on: {time}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </InnerContainer>
        ) : (
          <p className="text-start text-custom-grey-text text-xs">
            You have not booked in anyone before.
          </p>
        )}
      </div>
    </DefaultCard>
  );
}
