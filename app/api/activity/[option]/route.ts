import { dbHandler } from "@/src/firebase/db";
import { getMethod } from "@/src/utils/API/getAPIMethod";
import getCurrentDate, { StringToTimestamp } from "@/src/utils/getCurrentDate";
import handleResponses from "@/src/utils/handleResponses";
import {
  GROUP_ACTIVITY_PARTICIPANT,
  GROUP_ACTIVITY_SCHEMA,
} from "@/src/utils/schemas/group-activities";
import { GROUP_ACTIVITIES_SCHEMA } from "@/src/utils/schemas/groups";
import { Timestamp } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { option } = getMethod(req.url);
  const fetchedData = await req.json();

  const { memberID, groupID } = fetchedData;

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
  } else if (option === "get") {
    const { id } = fetchedData;

    // fetch activity data
    const res = await dbHandler.get({ col_name: "GROUP-ACTIVITIES", id });
    if (!res.status)
      return NextResponse.json({ status: false, error: res.error });

    // fetch participants data
    const resA = await dbHandler.getDocs({
      col_name: `GROUP-ACTIVITIES/${id}/PARTICIPANTS`,
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
  }
  return NextResponse.json({
    status: false,
    error: "Invalid method provided to API request.",
  });
}
