import React, { useEffect, useState } from "react";
import Image from "next/image";
import { FriendsListType } from "./ProfileSection";
import { getFriendsList } from "@/src/utils/profile/getFriendsList";
import { useAuth } from "@/src/contexts/AuthContext";

export default function FriendsList() {
  const [friendsData, setFriendData] = useState<FriendsListType>();
  const { memberID } = useAuth();

  useEffect(() => {
    const handleFetch = async (memberID: string) => {
      const res = await getFriendsList({ memberID });
      setFriendData(res);
    };
    if (memberID) handleFetch(memberID);
  }, [friendsData, memberID]);

  if (friendsData) {
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
                  src="icons/icon_avatar.svg"
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
      </div>
    );
  }
}
