"use client";
import React, { useEffect, useState } from "react";
import DefaultCard from "../DefaultCard";
import Image from "next/image";
import SecondaryButton from "../utils/SecondaryButton";
import { twMerge } from "tailwind-merge";
import PrimaryButton from "../utils/PrimaryButton";
import HRow from "../utils/HRow";
import SignoutButton from "../utils/SignoutButton";
import { MEMBER_SCHEMA } from "@/src/utils/schemas/members";
import { dbHandler } from "@/src/firebase/db";
import { useAuth } from "@/src/contexts/AuthContext";
import FriendsList from "./FriendsList";
import LoadingIcon from "../utils/LoadingIcon";

export type FriendsListType = { [key: string]: MEMBER_SCHEMA };

export default function ProfileSection({ className }: { className: string }) {
  const { memberID } = useAuth();

  const [memberDetails, setMemberDetails] = useState<MEMBER_SCHEMA>();

  useEffect(() => {
    const handleFetch = async (memberID: string) => {
      const res = await dbHandler.get({ col_name: "MEMBERS", id: memberID });
      if (res.status) setMemberDetails(res.data);
    };
    if (memberID) handleFetch(memberID);
  }, [memberID]);

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
          <FriendsList />
        </>
      ) : (
        <LoadingIcon />
      )}
    </DefaultCard>
  );
}
