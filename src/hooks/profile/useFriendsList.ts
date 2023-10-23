import { FriendsListType } from "@/src/components/profile/ProfileSection";
import { getFriendsList } from "@/src/utils/profile/getFriendsList";
import { useEffect, useState } from "react";

export function useFriendsList(memberID: string) {
  const [friendsData, setFriendData] = useState<FriendsListType | null>();

  useEffect(() => {
    const handleFetch = async (memberID: string) => {
      const res = await getFriendsList({ memberID });
      if (!res) setFriendData(null);
      else setFriendData(res);
    };
    if (memberID) handleFetch(memberID);
  }, [friendsData, memberID]);

  return { friendsData, setFriendData };
}
