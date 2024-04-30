"use server";

import { dbHandler } from "@/src/firebase/db";
import handleResponses from "../../handleResponses";
import { GROUP_SCHEMA } from "../../schemas/groups";
import { COS_DAILY_SCHEMA, CosDailyType } from "../../schemas/cos";

export async function EditMemberCOSPoints(id: string, points: number) {
  try {
    const { error } = await dbHandler.edit({
      col_name: "MEMBERS",
      id,
      data: {
        dutyPoints: { cos: points },
      },
    });
    if (error) throw new Error(error);

    return handleResponses();
  } catch (err: any) {
    return handleResponses({ status: false, error: err.message });
  }
}

export async function RemoveMemberCOS(
  groupID: string,
  groupData: GROUP_SCHEMA,
  updatedMembers: string[]
) {
  try {
    const { error } = await dbHandler.edit({
      col_name: "GROUPS",
      id: groupID,
      data: {
        cos: {
          ...groupData.cos,
          members: updatedMembers,
        },
      },
    });
    if (error) throw new Error(error);

    return handleResponses();
  } catch (err: any) {
    return handleResponses({ status: false, error: err.message });
  }
}

export async function CreateCOSPlan(
  groupID: string,
  selectedMonth: number,
  plan: {
    [date: string]: CosDailyType;
  }
) {
  try {
    const { error } = await dbHandler.add({
      col_name: `GROUPS/${groupID}/COS`,
      id: `${selectedMonth}`,
      to_add: {
        groupID,
        plans: plan,
        month: selectedMonth,
      } as COS_DAILY_SCHEMA,
    });
    if (error) throw new Error(error);

    return handleResponses();
  } catch (err: any) {
    return handleResponses({ status: false, error: err.message });
  }
}

export async function DeleteCOSPlan(groupID: string, month: string) {
  try {
    const { error } = await dbHandler.delete({
      col_name: `GROUPS/${groupID}/COS`,
      id: `${month}`,
    });
    if (error) throw new Error(error);

    return handleResponses();
  } catch (err: any) {
    return handleResponses({ status: false, error: err.message });
  }
}

export async function EditCOSPlan(
  groupID: string,
  month: string,
  plans: {
    [date: string]: CosDailyType;
  }
) {
  try {
    const { error } = await dbHandler.edit({
      col_name: `GROUPS/${groupID}/COS`,
      id: `${month}`,
      data: {
        plans,
      },
    });
    if (error) throw new Error(error);

    return handleResponses();
  } catch (err: any) {
    return handleResponses({ status: false, error: err.message });
  }
}
