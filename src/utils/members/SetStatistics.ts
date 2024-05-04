"use server";

import { dbHandler } from "@/src/firebase/db";
import handleResponses from "../handleResponses";
import { ATP_SCHEMA, IPPT_SCHEMA, VOC_SCHEMA } from "../schemas/statistics";
import { DateToTimestamp } from "../getCurrentDate";
import { BADGE_SCHEMA, MEMBER_SCHEMA } from "../schemas/members";
import { BADGE_COLORS } from "../constants";

export async function getMembersData() {
  try {
    const { error, data } = await dbHandler.getSpecific({
      path: "MEMBERS",
      orderCol: "memberID",
      ascending: true,
    });
    if (error) throw new Error(error);
    return handleResponses({ data: JSON.parse(JSON.stringify(data)) });
  } catch (err: any) {
    return handleResponses({ status: false, error: err.message });
  }
}
export type IPPTStats = {
  age: number;
  pushups: number;
  situps: number;
  timing: number;
};
export async function calculateIPPT(stats: IPPTStats) {
  const { age, pushups, situps, timing } = stats;

  try {
    const route = `https://ippt.vercel.app/api?${new URLSearchParams({
      age: `${age}`,
      pushups: `${pushups}`,
      situps: `${situps}`,
      run: `${timing}`,
    })}`;

    const res = await fetch(route);
    if (!res.ok) throw new Error(route);

    const data = await res.json();

    return handleResponses({ data: data.total });
  } catch (err: any) {
    return handleResponses({ status: false, error: err.message });
  }
}
export async function setIPPT(
  id: string,
  stats: IPPTStats,
  date: { day: number; month: number; year: number }
) {
  try {
    const { pushups, situps, timing, age } = stats;
    const numTime = Number(timing);
    const { error: calcError, data: score } = await calculateIPPT({
      age,
      pushups,
      situps,
      timing: numTime,
    });
    if (calcError) throw new Error(calcError);

    const to_add = {
      dateCompleted: DateToTimestamp(
        new Date(date.year, date.month - 1, date.day)
      ),
      memberID: id,
      stats: {
        pushups: Number(pushups),
        situps: Number(situps),
        timing: numTime,
      },
      score: Number(score),
      statType: "IPPT",
    } as IPPT_SCHEMA;

    const { error, data } = await dbHandler.addGeneral({
      path: `MEMBERS/${id}/IPPT`,
      to_add,
    });
    if (error) throw new Error(error);

    const { id: ipptID } = data;
    const { error: idErr } = await dbHandler.edit({
      col_name: `MEMBERS/${id}/IPPT`,
      id: ipptID,
      data: {
        ipptID,
      },
    });
    if (idErr) throw new Error(idErr);

    // add badge
    if (score >= 85) {
      const { error: badgeErr } = await addBadge(id, "GOLD");
      if (badgeErr) throw new Error(badgeErr);
    }
    if (numTime <= 9 * 60) {
      const { error: badgeErr } = await addBadge(id, "FLASH");
      if (badgeErr) throw new Error(badgeErr);
    }

    return handleResponses();
  } catch (err: any) {
    return handleResponses({ status: false, error: err.message });
  }
}

export async function setVOC(
  members: string[],
  time: { min: number; sec: number },
  type: "VOC" | "SOC",
  date: { day: number; month: number; year: number }
) {
  try {
    const { min, sec } = time;

    // add VOC stat to each member's profile
    const arrPromise = members.map(async (id: string) => {
      const to_add = {
        memberID: id,
        score: Number(min * 60) + Number(sec),
        statType: type,
        dateCompleted: DateToTimestamp(
          new Date(date.year, date.month - 1, date.day)
        ),
      } as VOC_SCHEMA;
      const { error, data } = await dbHandler.addGeneral({
        path: `MEMBERS/${id}/${type}`,
        to_add,
      });
      if (error)
        return handleResponses({ status: false, error: error.message });

      return handleResponses({ data: { memberID: id, dataID: data.id } });
    });

    const resolvedArr = await Promise.all(arrPromise);
    // add VOC ID to each member's VOC data
    const arrPromiseA = resolvedArr.map(async (item: any) => {
      if (!item.status)
        return handleResponses({ status: false, error: item.error });
      const { dataID, memberID } = item.data;
      const { error } = await dbHandler.edit({
        col_name: `MEMBERS/${memberID}/${type}`,
        id: dataID,
        data: { dataID },
      });
      if (error)
        return handleResponses({ status: false, error: error.message });
      return handleResponses();
    });

    const resolvedArrA = await Promise.all(arrPromiseA);

    resolvedArrA.forEach((item: any) => {
      if (!item.status) throw new Error(item.error);
    });

    return handleResponses();
  } catch (err: any) {
    return handleResponses({ status: false, error: err.message });
  }
}

export async function setATP(
  id: string,
  score: number,
  date: { day: number; month: number; year: number }
) {
  try {
    const { error, data } = await dbHandler.addGeneral({
      path: `MEMBERS/${id}/ATP`,
      to_add: {
        memberID: id,
        score: Number(score),
        statType: "ATP",
        dateCompleted: DateToTimestamp(
          new Date(date.year, date.month - 1, date.day)
        ),
      } as ATP_SCHEMA,
    });
    if (error) throw new Error(error);

    const { id: atpID } = data;
    const { error: idErr } = await dbHandler.edit({
      col_name: `MEMBERS/${id}/ATP`,
      id: atpID,
      data: {
        atpID,
      },
    });
    if (idErr) throw new Error(idErr);

    if (score >= 29) {
      const { error: badgeErr } = await addBadge(id, "SHARPSHOOTER");
      if (badgeErr) throw new Error(badgeErr);
    }
    return handleResponses();
  } catch (err: any) {
    return handleResponses({ status: false, error: err.message });
  }
}

export async function addBadge(id: string, name: string) {
  try {
    if (!Object.keys(BADGE_COLORS).includes(name))
      throw new Error("Invalid Badge Name");

    const { error: memberErr, data } = await dbHandler.get({
      col_name: "MEMBERS",
      id,
    });
    if (memberErr) throw new Error(memberErr);
    const memberData = data as MEMBER_SCHEMA;
    const { badges } = memberData;
    let flag = false;
    for (let i = 0; i < badges.length; i++) {
      if (badges[i].name === name) {
        flag = true;
        break;
      }
    }
    if (!flag) {
      const badgeName = name;
      const to_add = {
        name: badgeName,
        colors: {
          bg: BADGE_COLORS[badgeName].bg,
          text: BADGE_COLORS[badgeName].text,
        },
      } as BADGE_SCHEMA;
      const { error: badgeErr } = await dbHandler.edit({
        col_name: "MEMBERS",
        id,
        data: {
          badges: [...badges, to_add],
        },
      });
      if (badgeErr) throw new Error(badgeErr);
    }
    return handleResponses();
  } catch (err: any) {
    return handleResponses({ status: false, error: err.message });
  }
}
