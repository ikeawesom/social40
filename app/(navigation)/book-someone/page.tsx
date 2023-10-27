"use client";
import React from "react";
import { ROLES_HIERARCHY } from "@/src/components/members/MemberProfileContainer";
import HeaderBar from "@/src/components/navigation/HeaderBar";
import RestrictedScreen from "@/src/components/screens/RestrictedScreen";
import { useProfile } from "@/src/hooks/profile/useProfile";
import LoadingScreenSmall from "@/src/components/screens/LoadingScreenSmall";
import BiboScanner from "@/src/components/bibo/BiboScanner";

export default function BookSomeoneInPage() {
  const { memberDetails } = useProfile();
  if (memberDetails) {
    const role = memberDetails.role;
    const aboveAdmin = ROLES_HIERARCHY[role] >= ROLES_HIERARCHY["admin"];
    if (aboveAdmin) {
      return (
        <>
          <HeaderBar back text="Book Someone In" />
          {aboveAdmin ? (
            <div className="flex flex-col items-center justify-start gap-4 mt-32">
              <h1 className="text-xl font-bold text-custom-dark-text text-center">
                Please put member's book in code into the scanner below.
              </h1>
              <BiboScanner />
            </div>
          ) : (
            <RestrictedScreen />
          )}
        </>
      );
    }
    return <RestrictedScreen />;
  }
  return <LoadingScreenSmall />;
}
