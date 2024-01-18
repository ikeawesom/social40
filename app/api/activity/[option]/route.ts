import { dbHandler } from "@/src/firebase/db";
import { getMethod } from "@/src/utils/API/getAPIMethod";
import getCurrentDate, { StringToTimestamp } from "@/src/utils/getCurrentDate";
import handleResponses from "@/src/utils/handleResponses";
import { FALLOUTS_SCHEMA } from "@/src/utils/schemas/activities";
import {
  GROUP_ACTIVITY_PARTICIPANT,
  GROUP_ACTIVITY_SCHEMA,
  GROUP_ACTIVITY_WAITLIST,
  REMARKS_SCHEMA,
} from "@/src/utils/schemas/group-activities";
import { GROUP_ACTIVITIES_SCHEMA } from "@/src/utils/schemas/groups";
import {
  ACTIVITY_PARTICIPANT_SCHEMA,
  MEMBER_SCHEMA,
} from "@/src/utils/schemas/members";
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

    const fetchedID = res.data.id as string;

    // add activity ID to activity document
    const resC = await dbHandler.edit({
      col_name: `GROUP-ACTIVITIES`,
      id: fetchedID,
      data: {
        activityID: fetchedID,
      },
    });

    if (!resC.status)
      return NextResponse.json({ status: false, error: resC.error });

    // add participated member as a sub collection of root path
    const to_addA = {
      dateJoined: createdOn,
      memberID,
      activityID: fetchedID,
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

    // add to member's group activities subcollection
    const to_addC = {
      activityID: fetchedID,
      dateJoined: createdOn,
      activityDate: timestamp,
    } as ACTIVITY_PARTICIPANT_SCHEMA;

    const resD = await dbHandler.add({
      col_name: `MEMBERS/${memberID}/GROUP-ACTIVITIES`,
      id: fetchedID,
      to_add: to_addC,
    });

    if (!resD.status)
      return NextResponse.json({ status: false, error: resD.error });

    return NextResponse.json({ status: true, data: fetchedID });
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
      activityID,
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

    const resC = await dbHandler.get({
      col_name: `GROUP-ACTIVITIES`,
      id: activityID,
    });

    if (!resC.status)
      return NextResponse.json({ status: false, error: resC.error });

    const { activityDate } = resC.data as GROUP_ACTIVITY_SCHEMA;

    // add to member's group activities subcollection
    const to_addA = {
      activityID,
      dateJoined: date,
      activityDate,
    } as ACTIVITY_PARTICIPANT_SCHEMA;

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
  } else if (option === "group-fallout") {
    const { fallReason, verifiedBy } = fetchedData;

    const to_add = {
      activityID,
      memberID,
      reason: fallReason,
      verifiedBy,
    } as FALLOUTS_SCHEMA;

    const res = await dbHandler.add({
      col_name: `GROUP-ACTIVITIES/${activityID}/FALLOUTS`,
      id: memberID,
      to_add,
    });

    if (!res.status)
      return NextResponse.json({ status: false, error: res.error });

    const resA = await dbHandler.delete({
      col_name: `MEMBERS/${memberID}/GROUP-ACTIVITIES`,
      id: activityID,
    });

    if (!resA.status)
      return NextResponse.json({ status: false, error: resA.error });

    return NextResponse.json({ status: true });
  } else if (option === "group-edit") {
    const { input } = fetchedData;

    const newTitle = input.title;
    const newDesc = input.desc;
    const newRestriction = input.restrict;
    const newDateStr = input.date;
    const timeRes = StringToTimestamp(newDateStr);

    if (!timeRes.status)
      return NextResponse.json({ status: false, error: timeRes.error });

    const newDateTimestamp = timeRes.data;

    const to_edit = {
      activityTitle: newTitle,
      activityDesc: newDesc,
      groupRestriction: newRestriction,
      activityDate: newDateTimestamp,
    };

    const res = await dbHandler.edit({
      col_name: `GROUP-ACTIVITIES`,
      id: activityID,
      data: to_edit,
    });

    if (!res.status)
      return NextResponse.json({ status: false, error: res.error });

    const resA = await dbHandler.edit({
      col_name: `GROUPS/${groupID}/GROUP-ACTIVITIES`,
      id: activityID,
      data: {
        activityTitle: newTitle,
        activityDesc: newDesc,
        activityDate: newDateTimestamp,
      },
    });

    if (!resA.status)
      return NextResponse.json({ status: false, error: resA.error });

    return NextResponse.json({ status: true });
  } else if (option == "group-delete") {
    // remove activity from all members first
    // get all participants from group
    const res = await dbHandler.getSpecific({
      path: `GROUP-ACTIVITIES/${activityID}/PARTICIPANTS`,
      orderCol: "dateJoined",
      ascending: true,
    });

    if (!res.status)
      return NextResponse.json({ status: false, error: res.error });

    const participantsData = res.data as {
      [memberID: string]: GROUP_ACTIVITY_PARTICIPANT;
    };

    const participantsPromiseList = Object.keys(participantsData).map(
      async (memberID: string) => {
        // remove activity from participants group-activities subcollection
        const res = await dbHandler.delete({
          col_name: `MEMBERS/${memberID}/GROUP-ACTIVITIES`,
          id: activityID,
        });
        if (!res.status)
          return handleResponses({ status: false, error: res.error });

        // remove participants from group-activities participants subcollection
        const resA = await dbHandler.delete({
          col_name: `GROUP-ACTIVITIES/${activityID}/PARTICIPANTS`,
          id: memberID,
        });
        if (!resA.status)
          return handleResponses({ status: false, error: resA.error });

        return handleResponses();
      }
    );

    const participantsPromise = await Promise.all(participantsPromiseList);

    participantsPromise.forEach((item: any) => {
      if (!item.status)
        return NextResponse.json({ status: false, error: item.error });
    });

    // remove activity from group
    const resA = await dbHandler.delete({
      col_name: `GROUPS/${groupID}/GROUP-ACTIVITIES`,
      id: activityID,
    });

    if (!resA.status)
      return NextResponse.json({ status: false, error: resA.error });

    // remove activity from root collection
    const resB = await dbHandler.delete({
      col_name: "GROUP-ACTIVITIES",
      id: activityID,
    });

    if (!resB.status)
      return NextResponse.json({ status: false, error: resB.error });

    return NextResponse.json({ status: true });
  } else if (option === "global-group-get") {
    const res = await dbHandler.getSpecific({
      path: "GROUP-ACTIVITIES",
      field: "groupID",
      criteria: "==",
      value: groupID,
      orderCol: "activityDate",
      ascending: false,
    });

    if (!res.status)
      return NextResponse.json({ status: false, error: res.error });

    return NextResponse.json({ data: res.data, status: true });
  } else if (option === "group-set-remark") {
    const remarks = fetchedData.remarks as string;
    const remarkTitle = fetchedData.remarkTitle as string;

    const to_add = {
      activityID,
      createdOn: getCurrentDate(),
      memberID,
      remarkTitle,
      remarks,
      read: {
        readOn: getCurrentDate(),
        status: false,
      },
    } as REMARKS_SCHEMA;

    const res = await dbHandler.addGeneral({
      path: `GROUP-ACTIVITIES/${activityID}/REMARKS`,
      to_add,
    });

    if (!res.status)
      return NextResponse.json({ error: res.error, status: false });

    const remarkID = res.data.id as string;

    const resA = await dbHandler.edit({
      col_name: `GROUP-ACTIVITIES/${activityID}/REMARKS`,
      id: remarkID,
      data: { remarkID },
    });

    if (!resA.status)
      return NextResponse.json({ error: resA.error, status: false });

    return NextResponse.json({ status: true });
  } else if (option === "group-get-remarks") {
    const res = await dbHandler.getSpecific({
      path: `GROUP-ACTIVITIES/${activityID}/REMARKS`,
      orderCol: "createdOn",
      ascending: false,
    });

    if (!res.status)
      return NextResponse.json({ error: res.error, status: false });
    return NextResponse.json({ status: true, data: res.data });
  } else if (option === "group-get-specific-remark") {
    const { remarkID } = fetchedData;

    const res = await dbHandler.get({
      col_name: `GROUP-ACTIVITIES/${activityID}/REMARKS`,
      id: remarkID,
    });

    if (!res.status)
      return NextResponse.json({ status: false, error: res.error });

    return NextResponse.json({ status: true, data: res.data });
  } else if (option === "group-set-remark-read") {
    const { remarkID } = fetchedData;
    const res = await dbHandler.edit({
      col_name: `GROUP-ACTIVITIES/${activityID}/REMARKS`,
      id: remarkID,
      data: {
        read: {
          status: true,
          readOn: getCurrentDate(),
        },
      },
    });
    if (!res.status)
      return NextResponse.json({ status: false, error: res.error });

    return NextResponse.json({ status: true });
  } else if (option === "get-hidden") {
    const res = await dbHandler.get({ col_name: "MEMBERS", id: memberID });
    if (!res.status)
      return NextResponse.json({ status: false, error: res.error });

    const data = res.data as MEMBER_SCHEMA;

    const { hiddenActivities } = data;
    if (hiddenActivities === undefined)
      return NextResponse.json({ status: true, data: [] });
    return NextResponse.json({ status: true, data: hiddenActivities });
  } else if (option === "set-dismiss") {
    const { activityID } = fetchedData;
    const res = await dbHandler.get({ col_name: "MEMBERS", id: memberID });
    if (!res.status)
      return NextResponse.json({ status: false, error: res.error });

    const data = res.data as MEMBER_SCHEMA;

    const { hiddenActivities } = data;

    var arr = [] as string[];
    if (hiddenActivities === undefined) {
      arr.push(activityID);
    } else {
      arr = hiddenActivities;
      if (!arr.includes(activityID)) arr.push(activityID);
    }

    const resA = await dbHandler.edit({
      col_name: "MEMBERS",
      id: memberID,
      data: {
        hiddenActivities: arr,
      },
    });

    if (!resA.status)
      return NextResponse.json({ status: false, error: resA.error });

    return NextResponse.json({ status: true, data: arr });
  } else if (option === "reset-dismiss") {
    const { activityID } = fetchedData;
    const res = await dbHandler.get({ col_name: "MEMBERS", id: memberID });
    if (!res.status)
      return NextResponse.json({ status: false, error: res.error });

    const data = res.data as MEMBER_SCHEMA;

    const { hiddenActivities } = data;

    var arr = [] as string[];
    if (hiddenActivities !== undefined && hiddenActivities.length > 0) {
      arr = hiddenActivities;
      if (arr.includes(activityID)) {
        const index = arr.indexOf(activityID);
        arr.splice(index, 1);
      }
    }

    const resA = await dbHandler.edit({
      col_name: "MEMBERS",
      id: memberID,
      data: {
        hiddenActivities: arr,
      },
    });

    if (!resA.status)
      return NextResponse.json({ status: false, error: resA.error });

    return NextResponse.json({ status: true, data: arr });
  }

  return NextResponse.json({
    status: false,
    error: "Invalid method provided to API request.",
  });
}
