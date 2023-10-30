import { FriendsListType } from "@/src/components/profile/ProfileSection";
import { getMethod } from "@/src/utils/API/getAPIMethod";
import { getFriendsList } from "@/src/utils/profile/getFriendsList";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const method = getMethod(request.url);
  const fetchedData = await request.json();

  if (!fetchedData)
    return NextResponse.json({
      error: "Member cookie not provided.",
      status: false,
    });

  const { memberID } = fetchedData;

  // methods include: friends,
  if (method === "friends") {
    const res = await getFriendsList({ memberID });
    if (!res)
      return NextResponse.json({
        error: "An unknown error has occured. Please try again later.",
        status: false,
      });
    const friendsList = res as FriendsListType;
    return NextResponse.json({ status: true, data: friendsList });
  }

  return NextResponse.json({
    status: false,
    error: "Invalid method provided to API request.",
  });
}
