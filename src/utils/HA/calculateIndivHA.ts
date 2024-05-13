"use server";
import { dbHandler } from "@/src/firebase/db";
import getCurrentDate, { DateToString } from "../getCurrentDate";
import { handleGroupMemberHA } from "../groups/HA/handleGroupMemberHA";
import handleResponses from "../handleResponses";
import { DailyHAType } from "../schemas/ha";
import { MEMBER_SCHEMA } from "../schemas/members";
import { getMembersData } from "../groups/getMembersData";
import { GROUP_SCHEMA } from "../schemas/groups";

export async function calculateAllMembersHA() {
  try {
    const { data, error } = await dbHandler.getSpecific({
      path: "MEMBERS",
      orderCol: "memberID",
      ascending: true,
    });
    if (error) throw new Error(error);
    const members = data as { [id: string]: MEMBER_SCHEMA };
    const { error: indivErr } = await calculateIndivHA(members);
    if (indivErr) throw new Error(indivErr);

    return handleResponses();
  } catch (err: any) {
    return handleResponses({ status: false, error: err.message });
  }
}

export async function calculateIndivHA(members: {
  [id: string]: MEMBER_SCHEMA;
}) {
  try {
    const promiseArr = Object.keys(members).map(async (memberID: string) => {
      const memberData = members[memberID];
      const { createdOn } = memberData;
      const date = new Date(createdOn.seconds * 1000);
      const [day, month, year] = DateToString(date).split(" ")[0].split("/");

      const { data, error } = await handleGroupMemberHA(
        { day, month, year },
        memberID
      );
      if (error) return handleResponses({ status: false, error });

      const {
        dailyActivities,
        HA: { isHA, id },
      } = data;

      const to_add = {
        memberID: id,
        dailyActivities: dailyActivities,
        isHA,
        lastUpdated: getCurrentDate(),
      } as DailyHAType;

      const { error: addErr } = await dbHandler.add({
        col_name: "HA",
        id,
        to_add,
      });

      if (addErr) return handleResponses({ status: false, error: addErr });
      return handleResponses();
    });

    const resolvedArr = await Promise.all(promiseArr);

    resolvedArr.forEach((item: any) => {
      if (item.error) throw new Error(item.error);
    });
    return handleResponses();
  } catch (err: any) {
    return handleResponses({ status: false, error: err.message });
  }
}

export async function calculateGroupIndivHA(
  groupID: string,
  members: string[]
) {
  try {
    const { data: memberData, error: memberErr } = await getMembersData(
      members
    );
    if (memberErr) throw new Error(memberErr);
    const { error } = await calculateIndivHA(memberData);
    if (error) throw new Error(error);
    const { data: grpData, error: groupErr } = await dbHandler.get({
      col_name: "GROUPS",
      id: groupID,
    });
    if (groupErr) throw new Error(groupErr);
    const groupData = grpData as GROUP_SCHEMA;
    const { error: reportErr } = await updateIndivGroup({
      [groupData.groupID]: groupData,
    });
    if (reportErr) throw new Error(reportErr);

    return handleResponses();
  } catch (err: any) {
    return handleResponses({ status: false, error: err.message });
  }
}

export async function updateGroups() {
  try {
    const { error, data } = await dbHandler.getSpecific({
      path: "GROUPS",
      orderCol: "groupID",
      ascending: false,
    });
    if (error) throw new Error(error);

    const groups = data as { [id: string]: GROUP_SCHEMA };
    const { error: indivErr } = await updateIndivGroup(groups);
    if (indivErr) throw new Error(indivErr);
    return handleResponses();
  } catch (err: any) {
    return handleResponses({ status: false, error: err.message });
  }
}

export async function updateIndivGroup(groups: { [id: string]: GROUP_SCHEMA }) {
  try {
    const promArr = Object.keys(groups).map(async (id: string) => {
      const { error } = await dbHandler.edit({
        col_name: "GROUPS",
        id,
        data: { lastUpdatedHA: getCurrentDate() },
      });
      if (error) return handleResponses({ status: false, error });
      return handleResponses();
    });

    const resolvedArray = await Promise.all(promArr);

    resolvedArray.forEach((item: any) => {
      if (item.error) throw new Error(item.error);
    });
    return handleResponses();
  } catch (err: any) {
    return handleResponses({ status: false, error: err.message });
  }
}
