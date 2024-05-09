import HRow from "@/src/components/utils/HRow";
import React from "react";
import CosMembers from "./CosMembers";
import AddMembersSection from "./AddMembersSection";
import { GROUP_SCHEMA } from "@/src/utils/schemas/groups";
import { getMemberCOSPoints } from "@/src/utils/groups/COS/getMemberCOSPoints";

export default async function COSMembersSection({
  members,
  groupData,
  admins,
  curMemberID,
}: {
  groupData: GROUP_SCHEMA;
  members: string[];
  admins: string[];
  curMemberID: string;
}) {
  try {
    const { data, error } = await getMemberCOSPoints(members);
    if (error) throw new Error(error);

    const membersPoints = data as { [memberID: string]: number };

    return (
      <div className="w-full">
        <div className="flex items-center justify-between gap-2 w-full">
          <h1 className="text-lg font-bold text-custom-dark-text">
            COS Members
          </h1>
          {admins.includes(curMemberID) && (
            <AddMembersSection groupData={groupData} curMembers={members} />
          )}
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
