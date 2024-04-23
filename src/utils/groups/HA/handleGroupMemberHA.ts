"use server";
import { Timestamp } from "firebase/firestore";
import handleResponses from "../../handleResponses";
import { dbHandler } from "@/src/firebase/db";
import { DateToTimestamp } from "../../getCurrentDate";
import { handleHA } from "./handleHA";
import { MEMBER_SCHEMA } from "../../schemas/members";
import { HA_REPORT_SCHEMA } from "../../schemas/ha";

export type DateType = {
  day: string;
  month: string;
  year: string;
};

const StringToTimestamp = (start: DateType) => {
  const date = new Date();
  date.setDate(parseInt(start.day));
  date.setMonth(parseInt(start.month) - 1);
  date.setFullYear(parseInt(start.year));
  return DateToTimestamp(date);
};

export async function handleGroupMemberHA(
  startDate: DateType,
  memberID: string
) {
  try {
    // fetch member details
    const { data: memberDetailsRes, error: errorMember } = await dbHandler.get({
      col_name: "MEMBERS",
      id: memberID,
    });

    if (errorMember) throw new Error(errorMember);

    const memberDetails = memberDetailsRes as MEMBER_SCHEMA;
    const name = `${memberDetails.rank} ${memberDetails.displayName}`.trim();

    // fetch member activities
    const { data, error } = await dbHandler.getSpecific({
      path: `MEMBERS/${memberID}/GROUP-ACTIVITIES`,
      orderCol: "activityDate",
      ascending: true,
    });

    if (error) throw new Error(error);

    let timestampList = [] as Timestamp[];

    Object.keys(data).forEach((activityID: string) => {
      const { activityDate } = data[activityID];
      timestampList.push(activityDate);
    });

    const startTimestamp = StringToTimestamp(startDate);

    const clockedHA = handleHA(startTimestamp, timestampList);

    return handleResponses({
      data: { status: clockedHA, id: memberID, displayName: name },
    });
  } catch (err: any) {
    return handleResponses({ status: false, error: err });
  }
}

export async function addReport(groupID: string, report: HA_REPORT_SCHEMA) {
  try {
    const { data, error } = await dbHandler.addGeneral({
      path: `GROUPS/${groupID}/HA-REPORTS`,
      to_add: report,
    });

    if (error) throw new Error(error);

    const { error: error2 } = await dbHandler.edit({
      col_name: `GROUPS/${groupID}/HA-REPORTS`,
      data: { reportID: data.id },
      id: data.id,
    });

    if (error2) throw new Error(error2);

    return handleResponses({ data: data.id });
  } catch (error: any) {
    return handleResponses({
      status: false,
      error,
    });
  }
}
