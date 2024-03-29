import React from "react";
import DefaultCard from "../DefaultCard";
import Image from "next/image";
import { twMerge } from "tailwind-merge";
import HRow from "../utils/HRow";
import { MEMBER_SCHEMA } from "@/src/utils/schemas/members";
import FriendsList from "./FriendsList";
import LoadingIcon from "../utils/LoadingIcon";
import StatusDot from "../utils/StatusDot";
import ToggleBibo from "./ToggleBibo";
import EditProfileButton from "./edit/EditProfileButton";
import ViewProfileButton from "./ViewProfileButton";
import { contentfulImageLoader } from "./edit/ProfilePicSection";

export type FriendsListType = { [key: string]: MEMBER_SCHEMA };

export default async function ProfileSection({
  className,
  memberData,
  friendsData,
}: {
  className?: string;
  memberData: MEMBER_SCHEMA;
  friendsData: FriendsListType;
}) {
  const bibo = memberData.bookedIn as boolean;
  const role = memberData.role as string;
  const memberID = memberData.memberID as string;

  const rankName = `${memberData.rank} ${memberData.displayName} ${
    role === "cos" ? "(COS)" : ""
  }`.trim();

  return (
    <DefaultCard
      className={twMerge(
        "flex flex-col gap-y-3 items-center justify-start relative",
        className
      )}
    >
      {memberData ? (
        <>
          <div className="flex flex-col gap-2 items-center justify-center">
            <div className="relative">
              <StatusDot
                status={bibo}
                className="absolute top-1 right-1 h-4 w-4 z-20 drop-shadow-md"
              />
              <div className="overflow-hidden rounded-full shadow-lg w-24 h-24 relative flex items-center justify-center">
                <Image
                  loader={contentfulImageLoader}
                  fill
                  sizes="100%"
                  src={
                    memberData.pfp ? memberData.pfp : "/icons/icon_avatar.svg"
                  }
                  alt="Profile"
                  className="object-cover drop-shadow-md cursor-pointer hover:opacity-70 duration-150 z-10 overflow-hidden"
                />
              </div>
            </div>
            <div className="flex flex-col items-center justify-center gap-0">
              <h1 className="font-bold text-custom-dark-text text-base">
                {rankName}
              </h1>
              <p className="text-center text-custom-grey-text text-xs">
                {memberData.memberID}
              </p>
            </div>
          </div>
          <div className="w-full flex gap-3 flex-col">
            <div className="w-full flex items-center justify-between gap-3">
              <EditProfileButton />
              <ToggleBibo memberID={memberID} role={role} fetchedBibo={bibo} />
            </div>
            <ViewProfileButton memberID={memberID} />
          </div>
          {/* <HRow />
          <FriendsList friendsData={friendsData} /> */}
        </>
      ) : (
        <LoadingIcon />
      )}
    </DefaultCard>
  );
}
