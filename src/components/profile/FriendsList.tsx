import React from "react";
import Image from "next/image";
import PrimaryButton from "../utils/PrimaryButton";
import { FriendsListType } from "./ProfileSection";

export default function FriendsList({
  friendsData,
}: {
  friendsData: FriendsListType;
}) {
  const empty = Object.keys(friendsData).length === 0;

  return (
    <div className="flex flex-col items-start justify-start gap-y-1 w-full">
      <h1 className="text-start font-semibold text-base">Friends</h1>
      {!empty ? (
        <ul className="flex flex-col items-start justify-start">
          {Object.keys(friendsData).map((memberID: string) => (
            <li
              className="flex flex-row gap-x-3 items-center justify-start"
              key={memberID}
            >
              <Image
                src="/icons/icon_avatar.svg"
                height={40}
                width={40}
                alt="Profile"
                className="drop-shadow-md"
              />
              <div className="flex flex-col items-start justify-start">
                <h1 className="font-bold text-custom-dark-text text-base">
                  {friendsData[memberID].displayName}
                </h1>
                <p className="text-center text-custom-grey-text text-xs">
                  {friendsData[memberID].memberID}
                </p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-start text-custom-grey-text text-xs">
          No friends added. Invite someone today!
        </p>
      )}
      <PrimaryButton className="mt-4">Invite Friends</PrimaryButton>
    </div>
  );
}
