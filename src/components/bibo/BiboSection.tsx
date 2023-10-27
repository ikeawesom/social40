"use client";
import React from "react";
import DefaultCard from "../DefaultCard";
import HRow from "../utils/HRow";
import { useProfile } from "@/src/hooks/profile/useProfile";
import PrimaryButton from "../utils/PrimaryButton";
import { useRouter } from "next/navigation";
import { ROLES_HIERARCHY } from "../members/MemberProfileContainer";

export default function BiboSection() {
  const router = useRouter();
  const { memberDetails } = useProfile();
  if (memberDetails) {
    const membersBookedIn = memberDetails.bookedInMembers;
    var empty = true;
    if (membersBookedIn && Object.keys(membersBookedIn).length === 0) {
      empty = false;
    }

    if (memberDetails) {
      const role = memberDetails.role;
      const aboveAdmin = ROLES_HIERARCHY[role] >= ROLES_HIERARCHY["admin"];
      if (aboveAdmin)
        return (
          <DefaultCard>
            <div className="flex flex-col items-start justify-start gap-y-1 w-full">
              <h1 className="text-start font-semibold text-base">Booked In</h1>
              {!empty ? (
                <></>
              ) : (
                <p className="text-start text-custom-grey-text text-xs">
                  You have not booked in anyone before.
                </p>
              )}
            </div>
            <PrimaryButton
              onClick={() => router.push("/book-someone")}
              className="mt-2"
            >
              Book Someone In
            </PrimaryButton>
          </DefaultCard>
        );
    }
  }
}
