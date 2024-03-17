import { dbHandler } from "@/src/firebase/db";
import { GROUP_MEMBERS_SCHEMA } from "../schemas/groups";
import handleResponses from "../handleResponses";
import { WAITLIST_SCHEMA } from "../schemas/waitlist";
import { GROUP_ACTIVITY_PARTICIPANT } from "../schemas/group-activities";

export async function deleteGroup(groupID: string) {
  try {
    const res = await dbHandler.getDocs({
      col_name: `GROUPS/${groupID}/MEMBERS`,
    });

    if (!res.status) throw new Error(res.error);

    const groupMembers = res.data as any[];

    // delete group from members data
    const deleteFromMemberList = groupMembers.map(async (item: any) => {
      const data = item.data() as GROUP_MEMBERS_SCHEMA;
      const { memberID, role } = data;
      if (role === "owner") {
        // remove group from group created in member's collection
        const resA = await dbHandler.delete({
          col_name: `MEMBERS/${memberID}/GROUPS-CREATED`,
          id: groupID,
        });
        return resA;
      } else {
        // remove group from group joined in member's collection
        const resA = await dbHandler.delete({
          col_name: `MEMBERS/${memberID}/GROUPS-JOINED`,
          id: groupID,
        });
        return resA;
      }
    });
    const deleteFromMembers = await Promise.all(deleteFromMemberList);
    deleteFromMembers.forEach((item: any) => {
      if (!item.status) throw new Error(item.error);
    });

    // check if waitlist subcollection exists
    const resWaitlist = await dbHandler.getDocs({
      col_name: `GROUPS/${groupID}/WAITLIST`,
    });

    if (!resWaitlist.status) throw new Error(resWaitlist.error);

    const waitListData = resWaitlist.data as any[];

    if (waitListData.length > 0) {
      // people in waitlist
      const deleteWaitlistPromise = waitListData.map(async (item: any) => {
        const data = item.data() as WAITLIST_SCHEMA;
        const memberID = data.memberID;
        const res = await dbHandler.delete({
          col_name: `GROUPS/${groupID}/WAITLIST`,
          id: memberID,
        });
        return res;
      });

      const waitlistResList = await Promise.all(deleteWaitlistPromise);

      waitlistResList.forEach((item: any) => {
        if (!item.status) throw new Error(item.error);
      });
    }

    // delete members from subcollection
    const resMemberList = await dbHandler.getDocs({
      col_name: `GROUPS/${groupID}/MEMBERS`,
    });

    if (!resMemberList.status) throw new Error(resMemberList.error);

    const membersList = resMemberList.data as any[];

    const deleteMembersListPromise = membersList.map(async (item: any) => {
      const data = item.data() as GROUP_MEMBERS_SCHEMA;
      const memberID = data.memberID;
      const res = await dbHandler.delete({
        col_name: `GROUPS/${groupID}/MEMBERS`,
        id: memberID,
      });
      return res;
    });

    const membersResList = await Promise.all(deleteMembersListPromise);

    membersResList.forEach((item: any) => {
      if (!item.status) throw new Error(item.error);
    });

    const resC = await deleteActivities(groupID);
    if (!resC.status) throw new Error(resC.error);

    // delete group document
    const resB = await dbHandler.delete({ col_name: "GROUPS", id: groupID });
    if (!resB.status) throw new Error(resB.error);
    return handleResponses();
  } catch (err: any) {
    return handleResponses({ error: err.message, status: false });
  }
}

export async function deleteActivities(groupID: string) {
  try {
    // delete activities
    const res = await dbHandler.getSpecific({
      path: `GROUPS/${groupID}/GROUP-ACTIVITIES`,
      orderCol: "groupID",
      ascending: false,
    });
    if (!res.status) throw new Error(res.error);
    const activitiesIDs = Object.keys(res.data) as string[];

    const resList = activitiesIDs.map(async (id: string) => {
      // delete participants
      const res = await deleteParticipants(id);
      if (!res.status)
        return handleResponses({ status: false, error: res.error });

      // remove activity from group
      const resA = await dbHandler.delete({
        col_name: `GROUPS/${groupID}/GROUP-ACTIVITIES`,
        id,
      });
      if (!resA.status)
        return handleResponses({ status: false, error: resA.error });

      // remove activity from root collection
      const resB = await dbHandler.delete({
        col_name: "GROUP-ACTIVITIES",
        id,
      });
      if (!resB.status)
        return handleResponses({ status: false, error: resB.error });

      return handleResponses();
    });

    const promList = await Promise.all(resList);

    promList.forEach((item: any) => {
      if (!item.status) throw new Error(item.error);
    });
    return handleResponses();
  } catch (err: any) {
    return handleResponses({ error: err.message, status: false });
  }
}

export async function deleteParticipants(activityID: string) {
  try {
    const res = await dbHandler.getSpecific({
      path: `GROUP-ACTIVITIES/${activityID}/PARTICIPANTS`,
      orderCol: "dateJoined",
      ascending: true,
    });

    if (!res.status) throw new Error(res.error);

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
      if (!item.status) throw new Error(item.error);
    });

    return handleResponses();
  } catch (err: any) {
    return handleResponses({ status: false, error: err.message });
  }
}
