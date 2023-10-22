import React from "react";
import DefaultCard from "../DefaultCard";
import Image from "next/image";
import SecondaryButton from "../utils/SecondaryButton";
import { twMerge } from "tailwind-merge";
import PrimaryButton from "../utils/PrimaryButton";
import HRow from "../utils/HRow";
import FriendsList from "./FriendsList";
import SignoutButton from "../utils/SignoutButton";
import { FRIENDS_SCHEMA, MEMBER_SCHEMA } from "@/src/utils/schemas/members";
import { getCookies } from "next-client-cookies/server";
import useFetchUserDataServer from "@/src/utils/useFetchUserDataServer";

export type FriendsListType = {
  friendsData: { [key: string]: MEMBER_SCHEMA };
  className?: string;
};

export default function ProfileSection({
  friendsData,
  className,
}: FriendsListType) {
  const memberDetails = useFetchUserDataServer();

  if (memberDetails)
    return (
      <DefaultCard
        className={twMerge(
          "flex flex-col gap-y-3 items-center justify-start relative",
          className
        )}
      >
        <div className="flex flex-col gap-2 items-center justify-center">
          <SignoutButton />
          <Image
            src="icons/icon_avatar.svg"
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
        <FriendsList friendsData={friendsData} />
      </DefaultCard>
    );
}
