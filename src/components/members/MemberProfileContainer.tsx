"use client";
import React from "react";
import { MEMBER_SCHEMA } from "@/src/utils/schemas/members";
import { useProfile } from "@/src/hooks/profile/useProfile";
import RestrictedScreen from "../screens/RestrictedScreen";
import LoadingScreen from "../screens/LoadingScreen";

const ROLES_HIERARCHY = {
  owner: 3,
  admin: 2,
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
    if (ROLES_HIERARCHY[role] >= ROLES_HIERARCHY[viewMemberData.role])
      return <div>{viewProfile}</div>;
    return <RestrictedScreen />;
  }
  return <LoadingScreen />;
}
