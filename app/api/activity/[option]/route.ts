import { dbHandler } from "@/src/firebase/db";
import { getMethod } from "@/src/utils/API/getAPIMethod";
import { helperParticipate } from "@/src/utils/groups/handleGroupActivityCreate";
import getCurrentDate, {
  DateToTimestamp,
  StringToTimestamp,
} from "@/src/utils/helpers/getCurrentDate";
import handleResponses from "@/src/utils/helpers/handleResponses";
import { FALLOUTS_SCHEMA } from "@/src/utils/schemas/activities";
import {
  GROUP_ACTIVITY_PARTICIPANT,
  GROUP_ACTIVITY_SCHEMA,
  GROUP_ACTIVITY_WAITLIST,
  REMARKS_SCHEMA,
} from "@/src/utils/schemas/group-activities";
import { GROUP_ACTIVITIES_SCHEMA } from "@/src/utils/schemas/groups";
import { DailyHAType } from "@/src/utils/schemas/ha";
import { MEMBER_SCHEMA } from "@/src/utils/schemas/members";
import { Timestamp } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { option } = getMethod(req.url);
  const fetchedData = await req.json();

  const { memberID, groupID, activityID } = fetchedData;

  if (option === "group-get-requests") {
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
    // get group activity data
    const { data, error } = await dbHandler.get({
      col_name: "GROUP-ACTIVITIES",
      id: activityID,
    });
    if (error)
      return NextResponse.json({ status: false, error: error.message });
    const activityData = data as GROUP_ACTIVITY_SCHEMA;
    const { needsHA } = activityData;

    let canJoin = true;

    if (needsHA) {
      // check if member is HA
      const { data, error } = await dbHandler.get({
        col_name: "HA",
        id: memberID,
      });
      if (error)
        return NextResponse.json({ status: false, error: error.message });
      const haData = data as DailyHAType;
      const { isHA } = haData;
      console.log(isHA);
      canJoin = isHA;
    }

    console.log("can join", canJoin);

    if (!canJoin)
      return NextResponse.json({
        status: false,
        error: "Oops, we can't do that as this member is not HA!",
      });

    const { error: joinErr } = await helperParticipate(memberID, activityID);

    if (joinErr) return NextResponse.json({ status: false, error: joinErr });

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

    const tempTimestamp = timeRes.data as Timestamp;
    const tempDate = new Date(tempTimestamp.seconds * 1000);
    tempDate.setHours(tempDate.getHours() - 8);
    const newTimestamp = DateToTimestamp(tempDate);

    const to_edit = {
      activityTitle: newTitle,
      activityDesc: newDesc,
      groupRestriction: newRestriction,
      activityDate: newTimestamp,
      isPT: input.isPT,
    } as GROUP_ACTIVITY_SCHEMA;

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
        activityDate: newTimestamp,
        isPT: input.isPT,
      } as GROUP_ACTIVITIES_SCHEMA,
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

    // remove fallouts from group
    const resD = await dbHandler.getSpecific({
      path: `GROUP-ACTIVITIES/${activityID}/FALLOUTS`,
      orderCol: "memberID",
      ascending: false,
    });
    if (!resD.status)
      return NextResponse.json({ status: false, error: resD.error });

    const falloutList = resD.data as { [memberID: string]: FALLOUTS_SCHEMA };

    const resList = Object.keys(falloutList).map(async (id: string) => {
      const res = await dbHandler.delete({
        col_name: `GROUP-ACTIVITIES/${id}/FALLOUTS`,
        id,
      });
      if (!res.status)
        return handleResponses({ status: false, error: res.error });
      return handleResponses();
    });

    const promList = await Promise.all(resList);
    promList.forEach((item: any) => {
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
