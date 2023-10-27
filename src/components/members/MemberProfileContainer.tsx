"use client";
import React from "react";
import { MEMBER_SCHEMA } from "@/src/utils/schemas/members";
import { useProfile } from "@/src/hooks/profile/useProfile";
import RestrictedScreen from "../screens/RestrictedScreen";
import DefaultCard from "../DefaultCard";
import BookedStatus from "./BookedStatus";
import MemberPoints from "./MemberPoints";
import LoadingScreenSmall from "../screens/LoadingScreenSmall";
import MemberBadges from "./MemberBadges";

export const ROLES_HIERARCHY = {
  owner: 5,
  uadmin: 4,
  admin: 3,
  umember: 2,
  member: 1,
} as { [role: string]: number };

export default function MemberProfileContainer({
  viewProfile,
  viewMemberData,
}: {
  viewProfile: string;
  viewMemberData: MEMBER_SCHEMA;
}) {
  const { memberDetails } = useProfile();
  if (memberDetails) {
    const role = memberDetails.role;
    const rankName =
      `${viewMemberData.rank} ${viewMemberData.displayName}`.trim();
    if (ROLES_HIERARCHY[role] >= ROLES_HIERARCHY[viewMemberData.role])
      return (
        <div className="flex flex-col items-stretch justify-start gap-4">
          <DefaultCard className="flex flex-col items-start justify-center gap-2">
            <div className="flex w-full items-center justify-between">
              <MemberPoints points={viewMemberData.points} />
              <BookedStatus status={viewMemberData.bookedIn} />
            </div>
            <div className="flex flex-col items-start justify-center">
              <h1 className="text-xl text-custom-dark-text">{rankName}</h1>
              <p className="text-sm text-custom-grey-text">
                {viewMemberData.memberID}
              </p>
              <p className="text-sm text-custom-grey-text">
                Created on: {viewMemberData.createdOn}
              </p>
            </div>
            <MemberBadges badges={viewMemberData.badges} />
          </DefaultCard>
          <DefaultCard></DefaultCard>
        </div>
      );
    return <RestrictedScreen />;
  }
  return <LoadingScreenSmall />;
}
