"use server";

import { dbHandler } from "@/src/firebase/db";
import { Timestamp } from "firebase/firestore";
import getCurrentDate, {
  StringToTimestamp,
  DateToTimestamp,
  TimestampToDate,
  TimestampToDateString,
} from "../helpers/getCurrentDate";
import handleResponses from "../helpers/handleResponses";
import {
  GROUP_ACTIVITY_PARTICIPANT,
  GROUP_ACTIVITY_SCHEMA,
} from "../schemas/group-activities";
import { FALLOUTS_SCHEMA } from "../schemas/activities";
import { ACTIVITY_PARTICIPANT_SCHEMA, MEMBER_SCHEMA } from "../schemas/members";
import { STATUS_SCHEMA } from "../schemas/statuses";
import { GROUP_ACTIVITIES_SCHEMA } from "../schemas/groups";

export async function first(groupID: string, input: any, memberID: string) {
  try {
    // get timestamp object from time and date strings
    const timestampRes = StringToTimestamp(`${input.date} ${input.time}`);

    if (!timestampRes.status) throw new Error(timestampRes.error);
    const tempTimestamp = timestampRes.data as Timestamp;

    // UTC handler
    const tempDate = new Date(tempTimestamp.seconds * 1000);
    tempDate.setHours(tempDate.getHours() - 8);
    const timestamp = DateToTimestamp(tempDate);

    console.log("Server timestamp (from route): " + timestamp);

    const durationEnabled = input.duration.active as boolean;
    const timestampResA = durationEnabled
      ? StringToTimestamp(`${input.duration.endDate} ${input.duration.endTime}`)
      : handleResponses({ data: timestamp });

    if (!timestampResA.status) throw new Error(timestampResA.error);
    const cutOff = timestampResA.data as Timestamp;

    const activityLevel = input.level;

    // add activity record to root path
    const createdOn = getCurrentDate();
    const to_add = {
      activityDate: timestamp,
      activityDesc: input.desc.trim(),
      activityTitle: input.title.trim(),
      activityLevel,
      createdBy: memberID,
      createdOn,
      groupID,
      groupRestriction: input.restrict,
      duration: {
        active: durationEnabled,
        dateCutOff: cutOff,
      },
      isPT: input.pt,
      needsHA: input.needHA,
      refreshed: input.refreshed ?? false,
    } as GROUP_ACTIVITY_SCHEMA;

    const res = await dbHandler.addGeneral({
      path: "GROUP-ACTIVITIES",
      to_add,
    });

    if (!res.status) throw new Error(res.error);

    const fetchedID = res.data.id as string;

    // add activity ID to activity document
    const resC = await dbHandler.edit({
      col_name: `GROUP-ACTIVITIES`,
      id: fetchedID,
      data: {
        activityID: fetchedID,
      },
    });

    if (!resC.status) throw new Error(resC.error);
    return handleResponses({
      data: { timestamp, fetchedID, groupData: to_add },
    });
  } catch (err: any) {
    return handleResponses({ status: false, error: err.message });
  }
}

async function filterMembers(members: string[]) {
  let temp = [] as string[];

  const promiseArr = members.map(async (id: string) => {
    const { data } = await dbHandler.get({ col_name: "MEMBERS", id });
    const memberData = data as MEMBER_SCHEMA;
    const { isOnCourse } = memberData;
    if (isOnCourse) {
      // only those on course to join
      return handleResponses({ data: id });
    }
    return handleResponses();
  });

  const resolvedArr = await Promise.all(promiseArr);
  resolvedArr.forEach((item: any) => {
    if (item.data) temp.push(item.data);
  });
  return temp;
}
export async function second(
  addMembers: {
    check: string;
    members: string[];
  },
  groupID: string
) {
  try {
    let membersData = [] as string[];

    if (addMembers.check === "all") {
      const resX = await dbHandler.getSpecific({
        path: `GROUPS/${groupID}/MEMBERS`,
        orderCol: "dateJoined",
        ascending: false,
      });
      if (!resX.status) throw new Error(resX.error);

      membersData = Object.keys(resX.data);
    } else if (addMembers.check === "course") {
      const { data, error } = await dbHandler.getSpecific({
        path: `GROUPS/${groupID}/MEMBERS`,
        orderCol: "dateJoined",
        ascending: false,
      });
      if (error) throw new Error(error);

      const membersIDs = Object.keys(data);
      membersData = await filterMembers(membersIDs);
    } else if (addMembers.check === "custom") {
      membersData = addMembers.members;
    } else if (addMembers.check === "admins") {
      const { error, data } = await dbHandler.getSpecific({
        path: `GROUPS/${groupID}/MEMBERS`,
        field: "role",
        criteria: "!=",
        value: "member",
      });
      if (error) throw new Error(error);
      membersData = Object.keys(data);
    } else if (addMembers.check === "members") {
      const { error, data } = await dbHandler.getSpecific({
        path: `GROUPS/${groupID}/MEMBERS`,
        field: "role",
        criteria: "==",
        value: "member",
      });
      if (error) throw new Error(error);
      membersData = Object.keys(data);
    }

    return handleResponses({ data: membersData });
  } catch (err: any) {
    return handleResponses({ status: false, error: err.message });
  }
}

export async function third(
  addType: string,
  memberID: string,
  fetchedID: string,
  membersData: string[],
  timestamp: any,
  nonHAMembers: string[]
) {
  try {
    const promiseList = membersData.map(async (selectedMemberID: string) => {
      // // for admin clean up
      // const { error: adminErr } = await helperParticipate(
      //   selectedMemberID,
      //   fetchedID
      // );
      // if (adminErr) return handleResponses({ status: false, adminErr });

      // add non-HA members to fallouts straight away
      if (nonHAMembers.includes(selectedMemberID)) {
        const to_add = {
          activityID: fetchedID,
          memberID: selectedMemberID,
          reason: "Not HA Qualified",
          verifiedBy: memberID,
        } as FALLOUTS_SCHEMA;

        const res = await dbHandler.add({
          col_name: `GROUP-ACTIVITIES/${fetchedID}/FALLOUTS`,
          id: selectedMemberID,
          to_add,
        });

        if (!res.status)
          return handleResponses({ status: false, error: res.error });
        return handleResponses();
      }

      console.log("DEBUG: Added non-ha members to fallout");

      const res = await dbHandler.getSpecific({
        path: `MEMBERS/${selectedMemberID}/STATUSES`,
        orderCol: "endDate",
        ascending: false,
      });
      if (!res.status) throw new Error(res.error);

      console.log("DEBUG: before checking reason");

      let reason = "";

      // get status data from current member
      const statusData = res.data as { [statusID: string]: STATUS_SCHEMA };
      if (Object.keys(statusData).length > 0) {
        console.log("Checking status for:", selectedMemberID);
        const { startDate, endDate, statusTitle, mc } =
          statusData[Object.keys(statusData)[0]];
        console.log(
          "Latest status:",
          TimestampToDate(startDate),
          TimestampToDate(endDate),
          statusTitle
        );
        console.log(
          "Start:",
          TimestampToDate(startDate),
          "End:",
          TimestampToDate(endDate)
        );

        const activeStatus = isActive(timestamp, startDate, endDate);
        // handles MC/status plus 1
        const statusPlusOne = isActivePlusOne(timestamp, startDate, endDate);
        if (!activeStatus && !statusPlusOne) {
          // // if status/MC is over,
          // do not add to reason
        } else {
          // status is current, add to fall out
          if (activeStatus) {
            // status is active
            reason = `${statusTitle} (${
              TimestampToDateString(startDate).split(" ")[0]
            }-${TimestampToDateString(endDate).split(" ")[0]})`;
          } else {
            // status is +1
            reason = `${mc ? "MC + 1" : `STATUS + 1: ${statusTitle}`}`;
          }
        }
      }

      // if check for onCourse/bookedIn
      const { error, data } = await dbHandler.get({
        col_name: "MEMBERS",
        id: selectedMemberID,
      });

      if (error) return handleResponses({ status: false, error });
      const memberData = data as MEMBER_SCHEMA;
      const { bookedIn, isOnCourse } = memberData;

      console.log("reason for", selectedMemberID, reason);
      // if (bookedIn && !isOnCourse) {
      //   // booked in and not on course
      //   // do not add to reason
      // } else {
      //   if (!bookedIn && isOnCourse && addType === "course") {
      //     // not booked in but on course and activity is for on course
      //     // add member unless status
      //     // do not add to reason
      //   } else {
      //     if (!bookedIn && addType === "custom") {
      //       // not booked in, may/may not be on course but activity is for custom members
      //       // do not add to reason
      //     } else {
      //       if (isOnCourse && addType !== "course") {
      //         // not booked in, member on course but activity is not for course
      //         reason += `${reason !== "" ? " | " : ""}ON COURSE`;
      //       } else {
      //         // member not on course but member not booked in
      //         reason += `${reason !== "" ? " | " : ""}NOT BOOKED IN`;
      //       }
      //       console.log(reason);
      //     }
      //   }
      // }

      // // have reasons to fall out
      // if (reason !== "") {
      //   console.log("reason:", reason);
      //   const to_add = {
      //     activityID: fetchedID,
      //     memberID: selectedMemberID,
      //     reason,
      //     verifiedBy: memberID,
      //   } as FALLOUTS_SCHEMA;

      //   const res = await dbHandler.add({
      //     col_name: `GROUP-ACTIVITIES/${fetchedID}/FALLOUTS`,
      //     id: selectedMemberID,
      //     to_add,
      //   });

      //   if (!res.status)
      //     return handleResponses({ status: false, error: res.error });
      // } else {
      //   const { error } = await helperParticipate(selectedMemberID, fetchedID);
      //   if (error) return handleResponses({ status: false, error });
      // }
      return handleResponses();
    });

    const promiseRes = await Promise.all(promiseList);
    // for (const item of promiseRes) {
    //   if (!item.status) {
    //     console.log("error:", item.error);
    //     throw new Error(item.error);
    //   }
    // }
    // console.log("NO ERROR");
    return handleResponses();
  } catch (err: any) {
    console.log("ERROR");
    return handleResponses({ status: false, error: err.message });
  }
}

export async function fourth(
  fetchedID: string,
  activityDate: Timestamp,
  activityDesc: string,
  activityTitle: string,
  groupID: string,
  isPT: boolean
) {
  try {
    const to_addB = {
      activityDate,
      activityDesc,
      activityTitle,
      groupID,
      isPT,
      activityID: fetchedID,
    } as GROUP_ACTIVITIES_SCHEMA;

    const { error } = await dbHandler.add({
      col_name: `GROUPS/${groupID}/GROUP-ACTIVITIES`,
      id: fetchedID,
      to_add: to_addB,
    });

    if (error) throw new Error(error);
    return handleResponses({ data: fetchedID });
  } catch (err: any) {
    return handleResponses({ status: false, error: err.message });
  }
}

export async function helperParticipate(memberID: string, activityID: string) {
  try {
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

    if (!res.status) throw new Error(res.error);

    // remove from activity waitlist
    const resB = await dbHandler.delete({
      col_name: `GROUP-ACTIVITIES/${activityID}/WAITLIST`,
      id: memberID,
    });
    if (!resB.status) throw new Error(resB.error);

    const resC = await dbHandler.get({
      col_name: `GROUP-ACTIVITIES`,
      id: activityID,
    });

    if (!resC.status) throw new Error(resC.error);

    const { activityDate } = resC.data as GROUP_ACTIVITY_SCHEMA;

    // see if member fell out
    await dbHandler.delete({
      col_name: `GROUP-ACTIVITIES/${activityID}/FALLOUTS`,
      id: memberID,
    });

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

    if (!resA.status) throw new Error(resA.error);

    return handleResponses();
  } catch (err: any) {
    return handleResponses({ status: false, error: err.message });
  }
}

function isActive(a: any, start: Timestamp, end: Timestamp) {
  const date = TimestampToDate(a);
  const startDate = TimestampToDate(start);
  const endDate = TimestampToDate(end);
  return date <= endDate && date >= startDate;
}

function isActivePlusOne(a: any, start: Timestamp, end: Timestamp) {
  const date = TimestampToDate(a);
  const startDate = TimestampToDate(start);
  const endDate = TimestampToDate(end);
  endDate.setDate(endDate.getDate() + 1);
  return date <= endDate && date >= startDate;
}
