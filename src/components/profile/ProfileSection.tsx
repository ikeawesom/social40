"use client";
import React, { useState } from "react";
import DefaultCard from "../DefaultCard";
import Image from "next/image";
import SecondaryButton from "../utils/SecondaryButton";
import { twMerge } from "tailwind-merge";
import PrimaryButton from "../utils/PrimaryButton";
import HRow from "../utils/HRow";
import SignoutButton from "../utils/SignoutButton";
import { MEMBER_SCHEMA } from "@/src/utils/schemas/members";
import FriendsList from "./FriendsList";
import LoadingIcon from "../utils/LoadingIcon";
import { useProfile } from "@/src/hooks/profile/useProfile";
import { toast } from "sonner";
import LoadingScreenSmall from "../screens/LoadingScreenSmall";
import OfflineScreen from "../screens/OfflineScreen";
import StatusDot from "../utils/StatusDot";
import ToggleBibo from "./ToggleBibo";
import { useHostname } from "@/src/hooks/useHostname";
import { useMemberID } from "@/src/hooks/useMemberID";
import { useRouter } from "next/navigation";
import { ROLES_HIERARCHY } from "../members/MemberProfileContainer";

export type FriendsListType = { [key: string]: MEMBER_SCHEMA };

export default function ProfileSection({ className }: { className: string }) {
  const router = useRouter();
  const { memberID } = useMemberID();
  const { memberDetails, setMemberDetails } = useProfile();
  const { host } = useHostname();
  const [loading, setLoading] = useState(false);

  if (memberDetails) {
    const bibo = memberDetails.bookedIn as boolean;
    const role = memberDetails.role;
    const aboveAdmin = ROLES_HIERARCHY[role] >= ROLES_HIERARCHY["admin"];

    const handleBibo = async () => {
      if (bibo || aboveAdmin) {
        setLoading(true);
        try {
          const res = await fetch(`${host}/api/bibo`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              memberID: memberID,
            }),
          });
          if (res.status) setMemberDetails(undefined);
          else
            throw new Error(
              "An unknown error occurred. Please restart the app and try again."
            );
        } catch (error: any) {
          toast.error(error.message);
        }
        setLoading(false);
      } else {
        router.push("/bibo");
      }
    };
    return (
      <DefaultCard
        className={twMerge(
          "flex flex-col gap-y-3 items-center justify-start relative",
          className
        )}
      >
        {memberDetails ? (
          <>
            <div className="flex flex-col gap-2 items-center justify-center">
              <SignoutButton />
              <div className="relative">
                <StatusDot
                  status={bibo}
                  className="absolute top-1 right-1 h-4 w-4 z-20 drop-shadow-md"
                />
                <Image
                  src="/icons/icon_avatar.svg"
                  height={80}
                  width={80}
                  alt="Profile"
                  className="drop-shadow-md"
                />
              </div>
              <div className="flex flex-col items-center justify-center gap-0">
                <h1 className="font-bold text-custom-dark-text text-base">
                  {memberDetails.displayName}
                </h1>
                <p className="text-center text-custom-grey-text text-xs">
                  {memberDetails.memberID}
                </p>
              </div>
            </div>
            <div className="w-full flex items-stretch justify-between gap-3 flex-wrap">
              <SecondaryButton className="flex-1">Edit Profile</SecondaryButton>
              <ToggleBibo
                loading={loading}
                handleBibo={handleBibo}
                fetchedBibo={bibo}
              />
            </div>
            <HRow />
            <FriendsList />
            <PrimaryButton>Invite Friends</PrimaryButton>
          </>
        ) : (
          <LoadingIcon />
        )}
      </DefaultCard>
    );
  } else if (memberDetails === null) {
    toast.error(
      "There was an error loading your profile. Please refresh to try again."
    );
    return <OfflineScreen />;
  }

  return <LoadingScreenSmall />;
}
