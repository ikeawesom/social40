import { FriendsListType } from "@/src/components/profile/ProfileSection";
import { StatusListType } from "@/src/components/profile/StatsSection";
import { StatusInputType } from "@/src/components/status/CreateStatus";
import { dbHandler } from "@/src/firebase/db";
import { getMethod } from "@/src/utils/API/getAPIMethod";
import getCurrentDate from "@/src/utils/getCurrentDate";
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
    const res = await dbHandler.getSpecific({
      path: `MEMBERS/${memberID}/STATUSES`,
      orderCol: "endDate",
      ascending: false,
    });

    if (!res.status)
      return NextResponse.json({ status: false, error: res.error });

    const statusObj = res.data as StatusListType;

    return NextResponse.json({ status: true, data: statusObj });
  } else if (option === "set-status") {
    const data = fetchedData.status as StatusInputType;

    const to_add = {
      statusID: "",
      statusTitle: data.title,
      statusDesc: data.desc,
      memberID: memberID,
      doctor: data.doctor,
      endorsed: {
        status: false,
        endorsedBy: "",
      },
      startDate: data.start,
      endDate: data.end,
    } as STATUS_SCHEMA;

    const res = await dbHandler.addGeneral({
      path: `MEMBERS/${memberID}/STATUSES`,
      to_add: to_add,
    });

    if (!res.status)
      return NextResponse.json({ error: res.error, status: false });

    const fetchedStatusID = res.data.id as string;

    const resA = await dbHandler.edit({
      col_name: `MEMBERS/${memberID}/STATUSES`,
      id: fetchedStatusID,
      data: { statusID: fetchedStatusID },
    });

    if (!resA.status)
      return NextResponse.json({ error: resA.error, status: false });

    return NextResponse.json({ status: true });
  } else if (option === "endorse-status") {
    // endorse-status
    const { statusID, adminID } = fetchedData;
    const res = await dbHandler.edit({
      col_name: `MEMBERS/${memberID}/STATUSES`,
      id: statusID,
      data: {
        endorsed: {
          endorsedOn: getCurrentDate(),
          endorsedBy: adminID,
          status: true,
        },
      },
    });

    if (!res.status)
      return NextResponse.json({ status: false, error: res.error });
    return NextResponse.json({ status: true });
  }

  return NextResponse.json({
    status: false,
    error: "Invalid method provided to API request.",
  });
}
