"use server";

import { dbHandler } from "@/src/firebase/db";
import handleResponses from "../helpers/handleResponses";
import { authHandler } from "@/src/firebase/auth";
import { MEMBER_SCHEMA } from "../schemas/members";
import { getAuth } from "firebase/auth";
import { SECONDARY_FIREBASE_APP } from "@/src/firebase/config";
import { storageHandler } from "@/src/firebase/storage";
import { deleteGroup } from "./deleteGroup";

export async function purgeMembers(membersList: string[], groupID: string) {
  try {
    const resList = membersList.map(async (memberID: string) => {
      // delete auth account
      const resB = await dbHandler.get({ col_name: "MEMBERS", id: memberID });
      const memberData = resB.data as MEMBER_SCHEMA;
      const { password } = memberData;

      // sign into member acccount
      const auth = getAuth(SECONDARY_FIREBASE_APP);
      const email = `${memberID}@digital40sar.com`;
      const resC = await authHandler.signIn(auth, email, password);
      if (!resC.status)
        return handleResponses({ status: false, error: resC.error });

      // delete member from auth
      const uid = auth.currentUser?.uid;
      await auth.currentUser?.delete();
      await authHandler.signOutUser(auth);

      // delete data from members
      await deleteBIBO(memberID);
      await deleteGroupActivities(memberID);
      await deleteGroupsCreated(memberID);
      await deleteGroupsJoined(memberID);
      await deleteStatuses(memberID);
      await deletePFP(memberID);

      // delete final data layer from member
      const res = await dbHandler.delete({ col_name: "MEMBERS", id: memberID });
      if (!res.status)
        return handleResponses({ status: false, error: res.error });

      // delete from uid db
      const resD = await dbHandler.delete({ col_name: "MEMBERS-UID", id: uid });
      if (!resD.status)
        return handleResponses({ status: false, error: resD.error });

      // delete from group members
      const resA = await dbHandler.delete({
        col_name: `GROUPS/${groupID}/MEMBERS`,
        id: memberID,
      });
      if (!resA.status)
        return handleResponses({ status: false, error: resA.error });

      return handleResponses();
    });
    const listPromise = await Promise.all(resList);

    listPromise.forEach((item: any) => {
      if (!item.status) throw new Error(item.error);
    });

    return handleResponses();
  } catch (err: any) {
    return handleResponses({ status: false, error: err.message });
  }
}

export async function deleteBIBO(memberID: string) {
  try {
    const res = await dbHandler.getSpecific({
      path: `MEMBERS/${memberID}/BIBO`,
      orderCol: "timestamp",
      ascending: false,
    });

    const resList = Object.keys(res.data).map(async (id: string) => {
      const res = await dbHandler.delete({
        col_name: `MEMBERS/${memberID}/BIBO`,
        id,
      });
      if (!res.status)
        return handleResponses({ status: false, error: res.error });
      return handleResponses();
    });

    const listPromise = await Promise.all(resList);

    listPromise.forEach((item: any) => {
      if (!item.status) throw new Error(item.error);
    });
    return handleResponses();
  } catch (err: any) {
    return handleResponses({ status: false, error: err.message });
  }
}

export async function deleteGroupsJoined(memberID: string) {
  try {
    const res = await dbHandler.getSpecific({
      path: `MEMBERS/${memberID}/GROUPS-JOINED`,
      orderCol: "dateJoined",
      ascending: false,
    });

    const resList = Object.keys(res.data).map(async (id: string) => {
      // remove member from group
      const resA = await dbHandler.delete({
        col_name: `GROUPS/${id}/MEMBERS`,
        id: memberID,
      });
      if (!resA.status)
        return handleResponses({ status: false, error: resA.error });

      // remove group from member
      const res = await dbHandler.delete({
        col_name: `MEMBERS/${memberID}/GROUPS-JOINED`,
        id,
      });
      if (!res.status)
        return handleResponses({ status: false, error: res.error });
      return handleResponses();
    });

    const listPromise = await Promise.all(resList);

    listPromise.forEach((item: any) => {
      if (!item.status) throw new Error(item.error);
    });
    return handleResponses();
  } catch (err: any) {
    return handleResponses({ status: false, error: err.message });
  }
}

export async function deleteGroupsCreated(memberID: string) {
  try {
    const res = await dbHandler.getSpecific({
      path: `MEMBERS/${memberID}/GROUPS-CREATED`,
      orderCol: "createdOn",
      ascending: false,
    });

    const resList = Object.keys(res.data).map(async (id: string) => {
      const res = await deleteGroup(id);
      if (!res.status)
        return handleResponses({ status: false, error: res.error });
      return handleResponses();
    });

    const listPromise = await Promise.all(resList);

    listPromise.forEach((item: any) => {
      if (!item.status) throw new Error(item.error);
    });
    return handleResponses();
  } catch (err: any) {
    return handleResponses({ status: false, error: err.message });
  }
}

export async function deleteGroupActivities(memberID: string) {
  try {
    const res = await dbHandler.getSpecific({
      path: `MEMBERS/${memberID}/GROUP-ACTIVITIES`,
      orderCol: "dateJoined",
      ascending: false,
    });
    const activitesIDs = Object.keys(res.data) as string[];

    const resList = activitesIDs.map(async (id: string) => {
      // remove member from activity
      const resA = await dbHandler.delete({
        col_name: `GROUP-ACTIVITIES/${id}/PARTICIPANTS`,
        id: memberID,
      });
      if (!resA.status)
        return handleResponses({ status: false, error: resA.error });

      // remove activities from members
      const res = await dbHandler.delete({
        col_name: `MEMBERS/${memberID}/GROUP-ACTIVITIES`,
        id,
      });
      if (!res.status)
        return handleResponses({ status: false, error: res.error });

      return handleResponses();
    });

    const listPromise = await Promise.all(resList);

    listPromise.forEach((item: any) => {
      if (!item.status) throw new Error(item.error);
    });
    return handleResponses();
  } catch (err: any) {
    return handleResponses({ status: false, error: err.message });
  }
}

export async function deleteStatuses(memberID: string) {
  try {
    const res = await dbHandler.getSpecific({
      path: `MEMBERS/${memberID}/STATUSES`,
      orderCol: "endDate",
      ascending: false,
    });

    const resList = Object.keys(res.data).map(async (id: string) => {
      const res = await dbHandler.delete({
        col_name: `MEMBERS/${memberID}/STATUSES`,
        id,
      });
      if (!res.status)
        return handleResponses({ status: false, error: res.error });
      return handleResponses();
    });

    const listPromise = await Promise.all(resList);

    listPromise.forEach((item: any) => {
      if (!item.status) throw new Error(item.error);
    });
    return handleResponses();
  } catch (err: any) {
    return handleResponses({ status: false, error: err.message });
  }
}

export async function deletePFP(memberID: string) {
  try {
    const res = await storageHandler.delete({ path: `PROFILE/${memberID}` });
    if (!res.status) throw new Error(res.error);
    return handleResponses();
  } catch (err: any) {
    return handleResponses({ status: false, error: err.message });
  }
}
