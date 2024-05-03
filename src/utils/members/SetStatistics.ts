"use server";

import { dbHandler } from "@/src/firebase/db";
import handleResponses from "../handleResponses";
import { IPPT_SCHEMA } from "../schemas/statistics";
import { DateToTimestamp } from "../getCurrentDate";

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

    const { error: calcError, data: score } = await calculateIPPT({
      age,
      pushups,
      situps,
      timing,
    });
    if (calcError) throw new Error(calcError);

    const to_add = {
      ipptDate: DateToTimestamp(new Date(date.year, date.month - 1, date.day)),
      memberID: id,
      stats: {
        pushups,
        situps,
        timing,
        score,
      },
    } as IPPT_SCHEMA;

    const { error, data } = await dbHandler.addGeneral({
      path: `MEMBERS/${id}/IPPT`,
      to_add,
    });
    if (error) throw new Error(error);
    console.log(data.id);
    return handleResponses();
  } catch (err: any) {
    return handleResponses({ status: false, error: err.message });
  }
}
