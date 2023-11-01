import { FriendsListType } from "@/src/components/profile/ProfileSection";
import { StatusListType } from "@/src/components/profile/StatsSection";
import { dbHandler } from "@/src/firebase/db";
import { getMethod } from "@/src/utils/API/getAPIMethod";
import { getFriendsList } from "@/src/utils/profile/getFriendsList";
import { MEMBER_SCHEMA } from "@/src/utils/schemas/members";
import { STATUS_SCHEMA } from "@/src/utils/schemas/statuses";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { option } = getMethod(request.url);
  const fetchedData = await request.json();

  if (!fetchedData)
    return NextResponse.json({
      error: "Member cookie not provided.",
      status: false,
    });

  const { memberID } = fetchedData;

  // methods include: friends, member
  if (option === "member") {
    const res = await dbHandler.get({ col_name: "MEMBERS", id: memberID });
    if (!res.status)
      return NextResponse.json({ error: res.error, status: false });
    const memberData = res.data as MEMBER_SCHEMA;
    return NextResponse.json({ status: true, data: memberData });
  } else if (option === "friends") {
    const res = await getFriendsList({ memberID });
    if (!res)
      return NextResponse.json({
        error: "An unknown error has occured. Please try again later.",
        status: false,
      });
    const friendsList = res as FriendsListType;
    return NextResponse.json({ status: true, data: friendsList });
  } else if (option === "status") {
    const res = await dbHandler.getDocs({
      col_name: `MEMBERS/${memberID}/STATUSES`,
    });
    if (!res.status)
      return NextResponse.json({ status: false, error: res.error });

    const statusArr = res.data as any[];
    const statusObj = {} as StatusListType;

    statusArr.forEach((item: any) => {
      const data = item.data() as STATUS_SCHEMA;
      statusObj[data.statusID] = data;
    });

    return NextResponse.json({ status: true, data: statusObj });
  }

  return NextResponse.json({
    status: false,
    error: "Invalid method provided to API request.",
  });
}
