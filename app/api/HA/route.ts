import { dbHandler } from "@/src/firebase/db";
import getCurrentDate, { DateToString } from "@/src/utils/getCurrentDate";
import { handleGroupMemberHA } from "@/src/utils/groups/HA/handleGroupMemberHA";
import handleResponses from "@/src/utils/handleResponses";
import { DailyHAType } from "@/src/utils/schemas/ha";
import { MEMBER_SCHEMA } from "@/src/utils/schemas/members";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const { error } = await calculateHA();
    console.log(error);
    if (error) throw new Error(error);
    return NextResponse.json({ status: true });
  } catch (err: any) {
    return NextResponse.json({ status: false, error: err.message });
  }
}

// data: {
//     dailyActivities: activityListPerDate,
//     HA: { isHA: clockedHA, id: memberID, displayName: name } as isHAType,
//   }
async function calculateHA() {
  try {
    const { data, error } = await dbHandler.getSpecific({
      path: "MEMBERS",
      orderCol: "memberID",
      ascending: true,
    });
    if (error) throw new Error(error);
    const members = data as { [id: string]: MEMBER_SCHEMA };

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
