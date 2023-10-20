import React from "react";
import { DataType } from "@/app/(navigation)/profile/page";
import Image from "next/image";

export default function FriendsList({ friendsList }: DataType) {
  if (friendsList)
    return (
      <div className="flex flex-col items-start justify-start gap-y-1">
        <h1 className="text-start font-semibold text-base">Friends</h1>
        {friendsList.length !== 0 ? (
          <ul className="flex flex-col items-start justify-start">
            {friendsList.map((item, index) => (
              <li className="flex flex-row gap-x-1 items-center justify-start">
                <Image
                  src="icons/icon_avatar.svg"
                  height={40}
                  width={40}
                  alt="Profile"
                  className="drop-shadow-md"
                />
                <div className="flex flex-col items-start justify-start">
                  <h1 className="font-bold text-custom-dark-text text-base">
                    {item.displayName}
                  </h1>
                  <p className="text-center text-custom-grey-text text-xs">
                    {item.username}
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
      </div>
    );
}
