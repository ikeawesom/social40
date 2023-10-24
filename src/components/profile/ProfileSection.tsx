"use client";
import React from "react";
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

export type FriendsListType = { [key: string]: MEMBER_SCHEMA };

export default function ProfileSection({ className }: { className: string }) {
  const { memberDetails } = useProfile();

  if (memberDetails) {
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
              <Image
                src="/icons/icon_avatar.svg"
                height={80}
                width={80}
                alt="Profile"
                className="drop-shadow-md"
              />
              <div className="flex flex-col items-center justify-center gap-0">
                <h1 className="font-bold text-custom-dark-text text-base">
                  {memberDetails.displayName}
                </h1>
                <p className="text-center text-custom-grey-text text-xs">
                  {memberDetails.memberID}
                </p>
              </div>
            </div>
            <SecondaryButton>Edit Profile</SecondaryButton>
            <PrimaryButton>Invite Friends</PrimaryButton>
            <HRow />
            <FriendsList />
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
  }

  return <LoadingScreenSmall />;
}
