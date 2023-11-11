import { dbHandler } from "@/src/firebase/db";
import { getMethod } from "@/src/utils/API/getAPIMethod";
import getCurrentDate, { StringToTimestamp } from "@/src/utils/getCurrentDate";
import handleResponses from "@/src/utils/handleResponses";
import {
  GROUP_ACTIVITY_PARTICIPANT,
  GROUP_ACTIVITY_SCHEMA,
  GROUP_ACTIVITY_WAITLIST,
} from "@/src/utils/schemas/group-activities";
import { GROUP_ACTIVITIES_SCHEMA } from "@/src/utils/schemas/groups";
import { ACTIVITY_PARTICIPANT_SCHEMA } from "@/src/utils/schemas/members";
import { Timestamp } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { option } = getMethod(req.url);
  const fetchedData = await req.json();

  const { memberID, groupID, activityID } = fetchedData;

  if (option === "group-create") {
    const { input } = fetchedData;
    // get timestamp object from time and date strings
    const timestampRes = StringToTimestamp(`${input.date} ${input.time}`);

    if (!timestampRes.status)
      return NextResponse.json({ status: false, error: timestampRes.error });
    const timestamp = timestampRes.data as Timestamp;

    const durationEnabled = input.duration.active as boolean;
    const timestampResA = durationEnabled
      ? StringToTimestamp(`${input.duration.endDate} ${input.duration.endTime}`)
      : handleResponses({ data: timestamp });

    if (!timestampResA.status)
      return NextResponse.json({ status: false, error: timestampResA.error });
    const cutOff = timestampResA.data as Timestamp;

    // add activity record to root path
    const createdOn = getCurrentDate();
    const to_add = {
      activityDate: timestamp,
      activityDesc: input.desc,
      activityTitle: input.title,
      createdBy: memberID,
      createdOn,
      participants: [memberID],
      groupID,
      groupRestriction: input.restrict,
      duration: {
        active: durationEnabled,
        dateCutOff: cutOff,
      },
    } as GROUP_ACTIVITY_SCHEMA;

    const res = await dbHandler.addGeneral({
      path: "GROUP-ACTIVITIES",
      to_add,
    });

    if (!res.status)
      return NextResponse.json({ status: false, error: res.error });

    // add participated member as a sub collection of root path
    const fetchedID = res.data.id as string;

    const to_addA = {
      dateJoined: createdOn,
      memberID,
    } as GROUP_ACTIVITY_PARTICIPANT;

    const resA = await dbHandler.add({
      col_name: `GROUP-ACTIVITIES/${fetchedID}/PARTICIPANTS`,
      id: memberID,
      to_add: to_addA,
    });

    if (!resA.status)
      return NextResponse.json({ status: false, error: resA.error });

    // add group activity to sub collection of group path
    const to_addB = {
      activityDate: timestamp,
      activityDesc: input.desc,
      activityTitle: input.title,
      activityID: fetchedID,
      groupID: groupID,
    } as GROUP_ACTIVITIES_SCHEMA;

    const resB = await dbHandler.add({
      col_name: `GROUPS/${groupID}/GROUP-ACTIVITIES`,
      id: fetchedID,
      to_add: to_addB,
    });

    if (!resB.status)
      return NextResponse.json({ status: false, error: resB.error });

    return NextResponse.json({ status: true });
  } else if (option === "group-get") {
    // fetch activity data
    const res = await dbHandler.get({
      col_name: "GROUP-ACTIVITIES",
      id: activityID,
    });
    if (!res.status)
      return NextResponse.json({ status: false, error: res.error });

    // fetch participants data
    const resA = await dbHandler.getDocs({
      col_name: `GROUP-ACTIVITIES/${activityID}/PARTICIPANTS`,
    });
    if (!resA.status)
      return NextResponse.json({ status: false, error: resA.error });

    const resData = resA.data as any[];
    const participants = {} as {
      [memberID: string]: GROUP_ACTIVITY_PARTICIPANT;
    };

    resData.forEach((item: any) => {
      const data = item.data() as GROUP_ACTIVITY_PARTICIPANT;
      const member = data.memberID as string;
      participants[member] = data;
    });

    const to_send = { activityData: res.data, participantsData: participants };

    return NextResponse.json({ status: true, data: to_send });
  } else if (option === "group-get-requests") {
    const res = await dbHandler.getSpecific({
      path: `GROUP-ACTIVITIES/${activityID}/WAITLIST`,
      orderCol: "dateRequested",
      ascending: false,
    });

    if (!res.status)
      return NextResponse.json({ status: false, error: res.error });

    return NextResponse.json({ status: true, data: res.data });
  } else if (option === "group-request") {
    const date = getCurrentDate();
    const to_add = {
      memberID,
      dateRequested: date,
    } as GROUP_ACTIVITY_WAITLIST;

    const res = await dbHandler.add({
      col_name: `GROUP-ACTIVITIES/${activityID}/WAITLIST`,
      id: memberID,
      to_add,
    });
    if (!res.status)
      return NextResponse.json({ status: false, error: res.error });
    return NextResponse.json({ status: true });
  } else if (option === "group-participate") {
    const date = getCurrentDate();
    // add to group participants subcollection
    const to_add = {
      memberID,
      dateJoined: date,
    } as GROUP_ACTIVITY_PARTICIPANT;

    const res = await dbHandler.add({
      col_name: `GROUP-ACTIVITIES/${activityID}/PARTICIPANTS`,
      id: memberID,
      to_add,
    });

    if (!res.status)
      return NextResponse.json({ status: false, error: res.error });

    // remove from activity waitlist
    const resB = await dbHandler.delete({
      col_name: `GROUP-ACTIVITIES/${activityID}/WAITLIST`,
      id: memberID,
    });
    if (!resB.status)
      return NextResponse.json({ status: false, error: resB.error });

    // add to member's group activities subcollection
    const to_addA = { dateJoined: date } as ACTIVITY_PARTICIPANT_SCHEMA;
    const resA = await dbHandler.add({
      col_name: `MEMBERS/${memberID}/GROUP-ACTIVITIES`,
      id: activityID,
      to_add: to_addA,
    });

    if (!resA.status)
      return NextResponse.json({ status: false, error: resA.error });

    return NextResponse.json({ status: true });
  } else if (option === "group-reject") {
    const res = await dbHandler.delete({
      col_name: `GROUP-ACTIVITIES/${activityID}/WAITLIST`,
      id: memberID,
    });
    if (!res.status)
      return NextResponse.json({ status: false, error: res.error });
    return NextResponse.json({ status: true });
  } else if (option === "group-leave") {
    // delete member from group subcollection
    const res = await dbHandler.delete({
      col_name: `GROUP-ACTIVITIES/${activityID}/PARTICIPANTS`,
      id: memberID,
    });

    if (!res.status)
      return NextResponse.json({ status: false, error: res.error });

    // delete group from member's joined activities
    const resA = await dbHandler.delete({
      col_name: `MEMBERS/${memberID}/GROUP-ACTIVITIES`,
      id: activityID,
    });

    if (!resA.status)
      return NextResponse.json({ status: false, error: resA.error });

    return NextResponse.json({ status: true });
  }

  return NextResponse.json({
    status: false,
    error: "Invalid method provided to API request.",
  });
}
