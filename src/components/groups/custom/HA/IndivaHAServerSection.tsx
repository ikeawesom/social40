import { dbHandler } from "@/src/firebase/db";
import ErrorScreenHandler from "@/src/components/ErrorScreenHandler";
import handleResponses from "@/src/utils/helpers/handleResponses";
import { GroupDetailsType } from "@/src/utils/schemas/groups";
import { DailyHAType } from "@/src/utils/schemas/ha";
import React from "react";
import IndivHAClient from "./IndivHAClient";
import RecalculateIndivHAButton from "./RecalculateIndivHAButton";
import getCurrentDate from "@/src/utils/helpers/getCurrentDate";

export default async function IndivaHAServerSection({
  groupID,
}: {
  groupID: string;
}) {
  try {
    const { data: grpMemberRes, error: membersErr } =
      await dbHandler.getSpecific({
        path: `GROUPS/${groupID}/MEMBERS`,
        orderCol: "memberID",
        ascending: true,
      });

    if (membersErr) throw new Error(membersErr);
    const members = grpMemberRes as GroupDetailsType;
    const promArr = Object.keys(members).map(async (id: string) => {
      const { data, error } = await dbHandler.get({ col_name: "HA", id });
      if (error) {
        if (error.includes("not found")) {
          const temp = {
            dailyActivities: {},
            isHA: false,
            lastUpdated: getCurrentDate(),
            memberID: id,
          } as DailyHAType;
          return handleResponses({ status: false, error, data: temp });
        }
        return handleResponses({ status: false, error });
      }
      return handleResponses({ data });
    });
    const resolvedArr = await Promise.all(promArr);

    const membersIDs = [] as string[];
    const NonHAMembers = {} as { [id: string]: DailyHAType };
    const HAMembers = {} as { [id: string]: DailyHAType };

    resolvedArr.forEach((item: any) => {
      const { error } = item;
      if (error && !error.includes("not found")) throw new Error(error);

      const memberData = item.data as DailyHAType;
      const { memberID, isHA } = memberData;
      membersIDs.push(memberID);

      isHA
        ? (HAMembers[memberID] = memberData)
        : (NonHAMembers[memberID] = memberData);
    });

    return (
      <>
        <RecalculateIndivHAButton groupID={groupID} members={membersIDs} />
        <div className="w-full flex flex-col items-start justify-start gap-4 mt-2">
          <IndivHAClient isHA members={JSON.parse(JSON.stringify(HAMembers))} />
          <IndivHAClient members={JSON.parse(JSON.stringify(NonHAMembers))} />
        </div>
      </>
    );
  } catch (err: any) {
    return ErrorScreenHandler(err);
  }
}
