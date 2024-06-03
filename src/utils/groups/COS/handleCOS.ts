"use server";

import { dbHandler } from "@/src/firebase/db";
import handleResponses from "../../helpers/handleResponses";
import { COS_DAILY_SCHEMA, CosDailyType } from "../../schemas/cos";
import { MEMBER_SCHEMA } from "../../schemas/members";
import { GROUP_SCHEMA } from "../../schemas/groups";

export async function getParticipantsOriginalPoints(groupID: string) {
  const { data, error } = await dbHandler.get({
    col_name: "GROUPS",
    id: groupID,
  });
  if (error) return handleResponses({ status: false, error });

  const groupData = data as GROUP_SCHEMA;
  const { cos } = groupData;
  if (!cos)
    return handleResponses({
      status: false,
      error: "COS is disabled for this group.",
    });

  const participants = cos.members;

  const promiseArr = participants.map(async (id: string) => {
    const { data, error } = await dbHandler.get({ col_name: "MEMBERS", id });
    if (error) return handleResponses({ status: false, error });
    const memberData = data as MEMBER_SCHEMA;
    return handleResponses({
      data: { id, originalPoints: memberData.dutyPoints.cos },
    });
  });

  const resolvedArr = await Promise.all(promiseArr);

  const oriScores = {} as { [id: string]: number };
  resolvedArr.forEach((item: any) => {
    if (!item.status)
      return handleResponses({ status: false, error: item.error });
    oriScores[item.data.id] = item.data.originalPoints;
  });

  return handleResponses({ data: oriScores });
}

export async function ToggleCOSAdmin(groupID: string, to_update: any) {
  try {
    const { error } = await dbHandler.edit({
      col_name: "GROUPS",
      id: groupID,
      data: to_update,
    });
    if (error) throw new Error(error);
    return handleResponses();
  } catch (err: any) {
    return handleResponses({ status: false, error: err.message });
  }
}

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
  updatedMembers: string[]
) {
  try {
    const { error } = await dbHandler.edit({
      col_name: "GROUPS",
      id: groupID,
      data: {
        cos: {
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
    const { error: pointsErr, data } = await getParticipantsOriginalPoints(
      groupID
    );
    if (pointsErr) throw new Error(pointsErr);

    const oriScores = data;

    const { error } = await dbHandler.add({
      col_name: `GROUPS/${groupID}/COS`,
      id: `${selectedMonth}`,
      to_add: {
        groupID,
        plans: plan,
        month: selectedMonth,
        confirmed: false,
        membersOriginalScores: oriScores,
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

export async function FinishCosDuty(
  groupID: string,
  month: string,
  date: string,
  id: string,
  points: number
) {
  try {
    const { error } = await dbHandler.edit({
      col_name: `GROUPS/${groupID}/COS`,
      id: month,
      data: {
        plans: {
          [date]: {
            finished: true,
          },
        },
      },
    });

    if (error) throw new Error(error);

    // update points
    const { error: upErr } = await dbHandler.edit({
      col_name: "MEMBERS",
      id,
      data: {
        dutyPoints: {
          cos: points,
        },
      },
    });

    if (upErr) throw new Error(upErr);
    return handleResponses();
  } catch (err: any) {
    return handleResponses({ status: false, error: err.message });
  }
}

export async function GetDisplayName(id: string) {
  try {
    const { error, data } = await dbHandler.get({ col_name: "MEMBERS", id });
    if (error) throw new Error(error);

    const memberData = data as MEMBER_SCHEMA;
    const displayName = `${memberData.rank} ${memberData.displayName}`.trim();
    return handleResponses({ data: displayName });
  } catch (err: any) {
    return handleResponses({ status: false, error: err.message });
  }
}
