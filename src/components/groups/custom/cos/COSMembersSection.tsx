import HRow from "@/src/components/utils/HRow";
import { dbHandler } from "@/src/firebase/db";
import handleResponses from "@/src/utils/handleResponses";
import { MEMBER_SCHEMA } from "@/src/utils/schemas/members";
import React from "react";
import CosMembers from "./CosMembers";
import AddMembersSection from "./AddMembersSection";
import { GROUP_SCHEMA } from "@/src/utils/schemas/groups";

export default async function COSMembersSection({
  members,
  groupData,
  admins,
}: {
  groupData: GROUP_SCHEMA;
  members: string[];
  admins: string[];
}) {
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

    return (
      <div className="w-full">
        <div className="flex items-center justify-between gap-2 w-full">
          <h1 className="text-lg font-bold text-custom-dark-text">
            Participating Members
          </h1>
          <AddMembersSection groupData={groupData} curMembers={members} />
        </div>
        <HRow className="mb-2" />
        <CosMembers
          groupData={groupData}
          admins={admins}
          membersPoints={membersPoints}
        />
      </div>
    );
  } catch (err: any) {
    console.log("[COS - Members]:", err.message);
    // return ErrorScreenHandler(err);
  }
}
