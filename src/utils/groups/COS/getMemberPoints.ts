import { dbHandler } from "@/src/firebase/db";
import handleResponses from "../../handleResponses";
import { MEMBER_SCHEMA } from "../../schemas/members";

export async function getMemberPoints(members: string[]) {
  try {
    const membersPoints = {} as { [memberID: string]: number };
    const sortedMemberPoints = [] as { points: number; memberID: string }[];

    const promiseArr = members.map(async (id: string) => {
      const { data, error } = await dbHandler.get({
        col_name: "MEMBERS",
        id,
      });
      if (error) return handleResponses({ status: false, error });
      return handleResponses({ data });
    });

    const resolvedArr = await Promise.all(promiseArr);

    resolvedArr.forEach((item: any) => {
      if (!item.status) throw new Error(item.error);
      const data = item.data as MEMBER_SCHEMA;
      const points = data.dutyPoints.cos;
      sortedMemberPoints.push({ points, memberID: data.memberID });
    });

    // sort list
    sortedMemberPoints.sort((a, b) => b.points - a.points);
    sortedMemberPoints.forEach((item: any) => {
      membersPoints[item.memberID] = item.points;
    });

    return handleResponses({ data: membersPoints });
  } catch (err: any) {
    return handleResponses({ status: false, error: err.message });
  }
}
