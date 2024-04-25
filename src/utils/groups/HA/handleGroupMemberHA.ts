"use server";
import { Timestamp } from "firebase/firestore";
import handleResponses from "../../handleResponses";
import { dbHandler } from "@/src/firebase/db";
import { DateToString, DateToTimestamp } from "../../getCurrentDate";
import { handleHA, resetDay } from "./handleHA";
import { MEMBER_SCHEMA } from "../../schemas/members";
import {
  AllDatesActivitiesType,
  EachActivityType,
  HA_REPORT_SCHEMA,
  isHAType,
} from "../../schemas/ha";
import { GROUP_ACTIVITY_SCHEMA } from "../../schemas/group-activities";
import { ROLES_HIERARCHY } from "../../constants";

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
    const { rank, displayName, role } = memberDetails;
    const name = `${rank} ${displayName}`.trim();

    // fetch member activities
    const { data, error } = await dbHandler.getSpecific({
      path: `MEMBERS/${memberID}/GROUP-ACTIVITIES`,
      orderCol: "activityDate",
      ascending: true,
    });

    if (error) throw new Error(error);

    // get activity data
    const activityData = (await getSortedActivities(data)) as {
      [id: string]: GROUP_ACTIVITY_SCHEMA;
    };

    let activityListPerDate = {} as AllDatesActivitiesType;
    let timestampList = [] as Timestamp[];

    Object.keys(activityData).forEach((activityID: string) => {
      const { activityDate } = activityData[activityID];
      timestampList.push(activityDate);

      // add to activityListDate
      const dateStr = DateToString(resetDay(activityDate));

      const tempData = {
        activityID,
        activityTitle: activityData[activityID].activityTitle,
        activityDateStr: dateStr,
      } as EachActivityType;

      activityListPerDate[dateStr][activityID] = tempData;
    });

    const startTimestamp = StringToTimestamp(startDate);
    const updateTimestampList = timestampList.map((t: Timestamp) => {
      const date = new Date(t.seconds * 1000);
      date.setHours(date.getHours() + 8);
      return DateToTimestamp(date);
    });

    // console.log("Calculating for:", memberID);
    const isCommander =
      ROLES_HIERARCHY[role].rank >= ROLES_HIERARCHY["commander"].rank;

    const clockedHA = handleHA(
      startTimestamp,
      updateTimestampList,
      isCommander
    );

    return handleResponses({
      data: {
        dailyActivities: activityListPerDate,
        HA: { isHA: clockedHA, id: memberID, displayName: name } as isHAType,
      },
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

async function getSortedActivities(data: {
  [id: string]: GROUP_ACTIVITY_SCHEMA;
}) {
  const activityData = {} as { [id: string]: GROUP_ACTIVITY_SCHEMA };
  const sortedDataList = [] as GROUP_ACTIVITY_SCHEMA[];

  const promiseList = Object.keys(data).map(async (id: string) => {
    const { data, error } = await dbHandler.get({
      col_name: "GROUP-ACTIVITIES",
      id,
    });
    if (error) return handleResponses({ status: false, error });
    return handleResponses({ data });
  });

  const listPromise = await Promise.all(promiseList);

  listPromise.forEach((item: any) => {
    if (!item.status) throw new Error(item.error);
    const data = item.data as GROUP_ACTIVITY_SCHEMA;
    // activityData[data.activityID] = data;
    if (data.isPT) sortedDataList.push(data);
  });

  sortedDataList.sort(function (a, b) {
    return (
      new Date(a.activityDate.seconds * 1000).getTime() -
      new Date(b.activityDate.seconds * 1000).getTime()
    );
  });

  sortedDataList.forEach((item: GROUP_ACTIVITY_SCHEMA) => {
    activityData[item.activityID] = item;
  });

  return activityData;
}
