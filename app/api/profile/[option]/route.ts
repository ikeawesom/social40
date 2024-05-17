import { FriendsListType } from "@/src/components/profile/ProfileSection";
import { StatusListType } from "@/src/components/profile/StatsSection";
import { StatusInputType } from "@/src/components/status/CreateStatus";
import { dbHandler } from "@/src/firebase/db";
import { getMethod } from "@/src/utils/API/getAPIMethod";
import getCurrentDate, {
  DateToTimestamp,
  StringToTimestamp,
} from "@/src/utils/helpers/getCurrentDate";
import handleResponses from "@/src/utils/helpers/handleResponses";
import { getFriendsList } from "@/src/utils/profile/getFriendsList";
import resetPassword from "@/src/utils/profile/resetPassword";
import { GROUP_ACTIVITY_SCHEMA } from "@/src/utils/schemas/group-activities";
import {
  ACTIVITY_PARTICIPANT_SCHEMA,
  MEMBER_SCHEMA,
} from "@/src/utils/schemas/members";
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
  } else if (option === "edit") {
    const { rank, name } = fetchedData;
    const rankChange = {
      rank,
    };
    const nameChange = {
      displayName: name,
    };
    const res = await dbHandler.edit({
      col_name: "MEMBERS",
      id: memberID,
      data: rankChange,
    });

    if (!res.status)
      return NextResponse.json({
        error: `Rank Change Error: ${res.error}`,
        status: false,
      });

    const resA = await dbHandler.edit({
      col_name: "MEMBERS",
      id: memberID,
      data: nameChange,
    });

    if (!resA.status)
      return NextResponse.json({
        error: `Name Change Error: ${resA.error}`,
        status: false,
      });

    // update group members details

    // get groups
    const resB = await dbHandler.getSpecific({
      path: `MEMBERS/${memberID}/GROUPS-JOINED`,
      orderCol: "dateJoined",
      ascending: true,
    });

    if (!resB.status)
      return NextResponse.json({ status: false, error: resB.error });

    const resC = await dbHandler.getSpecific({
      path: `MEMBERS/${memberID}/GROUPS-CREATED`,
      orderCol: "createdOn",
      ascending: true,
    });

    if (!resC.status)
      return NextResponse.json({ status: false, error: resC.error });

    const groupIDArr = Object.keys(resB.data).concat(Object.keys(resC.data));

    const arrPromise = groupIDArr.map(async (groupID: string) => {
      const res = await dbHandler.edit({
        col_name: `GROUPS/${groupID}/MEMBERS`,
        id: memberID,
        data: {
          displayName: `${rank} ${name}`.trim(),
        },
      });
      if (!res.status)
        return handleResponses({ status: false, error: res.error });
      return handleResponses();
    });
    const promiseArr = await Promise.all(arrPromise);

    promiseArr.forEach((item: any) => {
      if (!item.status)
        return NextResponse.json({ status: false, error: item.error });
    });

    return NextResponse.json({ status: true });
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
  } else if (option === "set-permission") {
    const { permission } = fetchedData;

    const res = await dbHandler.edit({
      col_name: `MEMBERS`,
      id: memberID,
      data: { role: permission },
    });

    if (!res.status)
      return NextResponse.json({ status: false, error: res.error });
    return NextResponse.json({ status: true });
  } else if (option === "set-status") {
    const { mc } = fetchedData;
    const data = fetchedData.status as StatusInputType;

    const startDate = `${data.start} 00:00`;
    const endDate = `${data.end} 23:59`;
    const startTimestamp = StringToTimestamp(startDate);
    const endTimestamp = StringToTimestamp(endDate);

    if (!startTimestamp.status || !endTimestamp.status)
      return NextResponse.json({
        status: false,
        error: startTimestamp.error ? startTimestamp.error : endTimestamp.error,
      });

    const { data: tempEndTimestamp } = endTimestamp;
    const tempEndDate = new Date(tempEndTimestamp.seconds * 1000);
    tempEndDate.setHours(tempEndDate.getHours() - 8);
    // tempEndDate.setDate(tempEndDate.getDate() + 1);
    const newEndTimestamp = DateToTimestamp(tempEndDate);

    const { data: tempStartTimestamp } = startTimestamp;
    const tempStartDate = new Date(tempStartTimestamp.seconds * 1000);
    tempStartDate.setHours(tempStartDate.getHours() - 8);
    // tempStartDate.setDate(tempStartDate.getDate() + 1);
    const newStartTimestamp = DateToTimestamp(tempStartDate);

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
      startDate: newStartTimestamp,
      endDate: newEndTimestamp,
      mc,
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
  } else if (option === "custom-status") {
    // get a specific status
    const { statusID } = fetchedData;

    const res = await dbHandler.get({
      col_name: `MEMBERS/${memberID}/STATUSES`,
      id: statusID,
    });
    if (!res.status)
      return NextResponse.json({ status: false, error: res.error });

    return NextResponse.json({ status: true, data: res.data });
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
  } else if (option === "member-status") {
    // check if status belongs to member
    const { statusID } = fetchedData;
    const res = await dbHandler.get({
      col_name: `MEMBERS/${memberID}/STATUSES`,
      id: statusID,
    });

    if (!res.status)
      return NextResponse.json({ status: false, error: res.error });
    return NextResponse.json({ status: true });
  } else if (option === "revoke-status") {
    const { statusID } = fetchedData;

    const res = await dbHandler.delete({
      col_name: `MEMBERS/${memberID}/STATUSES`,
      id: statusID,
    });

    if (!res.status)
      return NextResponse.json({ status: false, error: res.error });
    return NextResponse.json({ status: true });
  } else if (option === "feedback-done") {
    const res = await dbHandler.edit({
      col_name: "MEMBERS",
      id: memberID,
      data: { feedback: true },
    });

    if (!res.status)
      return NextResponse.json({ status: false, error: res.error });

    return NextResponse.json({ status: true });
  } else if (option === "reset-password") {
    const { newPassword } = fetchedData;

    // get password from DB
    const res = await dbHandler.get({ col_name: `MEMBERS`, id: memberID });
    if (!res.status)
      return NextResponse.json({ status: false, error: res.error });

    const { password } = res.data as MEMBER_SCHEMA;

    // reset auth password
    const resA = await resetPassword(memberID, password, newPassword);
    if (!resA.status)
      return NextResponse.json({ status: false, error: resA.error });

    // reset password in DB
    const resB = await dbHandler.edit({
      col_name: `MEMBERS`,
      data: { password: newPassword },
      id: memberID,
    });
    if (!resB.status)
      return NextResponse.json({ status: false, error: resB.error });

    return NextResponse.json({ status: true });
  } else if (option === "pfp") {
    const { pfp } = fetchedData;
    const res = await dbHandler.edit({
      col_name: "MEMBERS",
      id: memberID,
      data: { pfp },
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
