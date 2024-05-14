export const dynamic = "force-dynamic"; // static by default, unless reading the request
export const maxDuration = 59; // This function can run for a maximum of 5 seconds
export const runtime = "nodejs";

import {
  calculateAllMembersHA,
  updateGroups,
} from "@/src/utils/HA/calculateIndivHA";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const { error } = await calculateAllMembersHA();
    if (error) throw new Error(error);
    const { error: groupErr } = await updateGroups();
    if (groupErr) throw new Error(groupErr);
    return NextResponse.json({ status: true });
  } catch (err: any) {
    return NextResponse.json({ status: false, error: err.message });
  }
}

//// data: {
//     dailyActivities: activityListPerDate,
//     HA: { isHA: clockedHA, id: memberID, displayName: name } as isHAType,
//   }
