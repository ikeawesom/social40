"use client";
import React from "react";
import DefaultCard from "../DefaultCard";
import HRow from "../utils/HRow";
import { useProfile } from "@/src/hooks/profile/useProfile";
import PrimaryButton from "../utils/PrimaryButton";
import { useRouter } from "next/navigation";
import { ROLES_HIERARCHY } from "../members/MemberProfileContainer";
import InnerContainer from "../utils/InnerContainer";

export default function BiboSection() {
  const router = useRouter();
  const { memberDetails } = useProfile();
  if (memberDetails) {
    const membersBookedIn = memberDetails.bookedInMembers;

    if (memberDetails) {
      const role = memberDetails.role;
      const aboveAdmin = ROLES_HIERARCHY[role] >= ROLES_HIERARCHY["admin"];
      if (aboveAdmin)
        return (
          <DefaultCard>
            <div className="flex flex-col items-start justify-start gap-y-1 w-full">
              <h1 className="text-start font-semibold text-base">
                Book in Members
              </h1>
              {membersBookedIn && Object.keys(membersBookedIn).length !== 0 ? (
                <>
                  {Object.keys(membersBookedIn).map((date, index) => {
                    const dateObj = membersBookedIn[date];
                    return (
                      <InnerContainer
                        key={index}
                        className="items-start justify-center"
                      >
                        <div className="flex flex-col items-start justify-center mb-3">
                          <h1 className="text-sm text-custom-grey-text px-3 text-start">
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
                                className="hover:bg-custom-light-text duration-200 w-full px-3 py-1"
                              >
                                <h1 className="font-bold text-custom-dark-text">
                                  {memberObject.memberID}
                                </h1>
                                <p className="text-sm text-custom-grey-text">
                                  Booked In member on: {time}
                                </p>
                              </div>
                            );
                          })}
                        </div>
                      </InnerContainer>
                    );
                  })}
                </>
              ) : (
                <p className="text-start text-custom-grey-text text-xs">
                  You have not booked in anyone before.
                </p>
              )}
            </div>
            <PrimaryButton
              onClick={() => router.push("/book-someone")}
              className="mt-4"
            >
              Book Someone In
            </PrimaryButton>
          </DefaultCard>
        );
    }
  }
}
