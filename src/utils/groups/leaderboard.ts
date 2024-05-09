import { dbHandler } from "@/src/firebase/db";
import handleResponses from "../handleResponses";
import { GROUP_MEMBERS_SCHEMA, GroupDetailsType } from "../schemas/groups";
import { MEMBER_SCHEMA } from "../schemas/members";
import { DEFAULT_STATS, DUTY_WEIGHTAGE, TOTAL_DUTY_POINTS } from "../constants";

type MemberScoresType = {
  type: string;
  score: number;
};

export async function appendMemberPFP(members: GroupDetailsType) {
  try {
    let temp = {} as GroupDetailsType;
    const promiseArr = Object.keys(members).map(async (id: string) => {
      const { data, error } = await dbHandler.get({ col_name: "MEMBERS", id });
      if (error) return handleResponses({ status: false, error });

      const memberData = data as MEMBER_SCHEMA;
      const { pfp, memberID } = memberData;
      return handleResponses({ data: { memberID, pfp } });
    });
    const resolvedArr = await Promise.all(promiseArr);
    resolvedArr.forEach((item: any) => {
      if (item.error) throw new Error(item.error);
      const { memberID, pfp } = item.data;
      temp[memberID] = { ...members[memberID], pfp };
    });
    return handleResponses({ data: temp });
  } catch (err: any) {
    return handleResponses({ status: false, error: err.message });
  }
}
export async function getMemberOverallPoints(members: GroupDetailsType) {
  try {
    const temp = {} as GroupDetailsType;
    const promiseArr = Object.keys(members).map(async (id: string) => {
      const { data, error } = await dbHandler.get({ col_name: "MEMBERS", id });
      if (error) return handleResponses({ status: false, error });

      const memberData = data as MEMBER_SCHEMA;
      const {
        dutyPoints: { cos: cosPoints, gd: gdPoints },
      } = memberData;

      const scoresPromise = Object.keys(DEFAULT_STATS).map(
        async (type: string) => {
          const score = await calculateScore(type, id);
          return { type, score };
        }
      );

      const resolvedScores = (await Promise.all(
        scoresPromise
      )) as MemberScoresType[];

      let score = 0;
      resolvedScores.forEach((item: MemberScoresType) => {
        const isTiming = DEFAULT_STATS[item.type].timing;
        const typeBestScore = DEFAULT_STATS[item.type].bestScore;
        const weightage = DEFAULT_STATS[item.type].weightage;
        let typeScore: number;
        if (item.score > 0) {
          if (isTiming) {
            if (item.score > typeBestScore) {
              // if timing is greater than failure score
              typeScore = 0;
            } else {
              typeScore = ((typeBestScore - item.score) / typeBestScore) * 100;
            }
          } else {
            typeScore = (item.score / typeBestScore) * 100;
          }
        } else {
          // if item is a valid score
          typeScore = 0;
        }
        score += (typeScore / 100) * weightage;
      });

      score += (cosPoints / TOTAL_DUTY_POINTS) * DUTY_WEIGHTAGE;
      // + (gdPoints / TOTAL_DUTY_POINTS) * DUTY_WEIGHTAGE;

      score = Math.ceil(score);

      const { dateJoined, displayName, memberID, role } = members[id];
      const to_return = {
        dateJoined,
        displayName,
        memberID,
        role,
        points: score,
      } as GROUP_MEMBERS_SCHEMA;

      return handleResponses({
        data: to_return,
      });
    });

    const resolvedArr = await Promise.all(promiseArr);

    resolvedArr.forEach((item: any) => {
      if (item.error) throw new Error(item.error);
      temp[item.data.memberID] = item.data;
    });

    return handleResponses({ data: temp });
  } catch (err: any) {
    return handleResponses({ status: false, error: err.message });
  }
}

export async function calculateScore(path: string, id: string) {
  const { data, error } = await dbHandler.getSpecific({
    path: `MEMBERS/${id}/${path}`,
    orderCol: "score",
    ascending: DEFAULT_STATS[path].scoringType === "ASC" ? true : false,
  });
  if (error) return 0;

  if (Object.keys(data).length > 0) {
    const bestIndex = Object.keys(data)[0];
    return data[bestIndex].score as number;
  }
  return 0;
}

export async function calculateMembersScores(path: string, members: string[]) {
  try {
    const promiseArr = members.map(async (id: string) => {
      const score = await calculateScore(path, id);
      return handleResponses({ data: { id, score } });
    });
    const resolvedArr = await Promise.all(promiseArr);
    const temp = {} as {
      [id: string]: { id: string; score: number; pfp: string | undefined };
    };
    resolvedArr.forEach((item: any) => {
      const { id } = item.data;
      temp[id] = item.data;
    });
    return handleResponses({ data: temp });
  } catch (err: any) {
    return handleResponses({ status: false, error: err.message });
  }
}

export async function getMembersCOSLeaderboardPoints(members: string[]) {
  try {
    const temp = {} as {
      [id: string]: { points: number; pfp: string | undefined };
    };
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
      const points = data.dutyPoints?.cos ?? 0;
      const { pfp } = data;
      temp[data.memberID] = { points, pfp };
    });
    return handleResponses({ data: temp });
  } catch (err: any) {
    return handleResponses({ status: false, error: err.message });
  }
}
