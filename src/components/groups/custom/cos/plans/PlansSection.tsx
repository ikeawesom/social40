import HRow from "@/src/components/utils/HRow";
import { dbHandler } from "@/src/firebase/db";
import ErrorScreenHandler from "@/src/components/ErrorScreenHandler";
import React from "react";
import CreatePlanSection from "./CreatePlanSection";
import CosPlansSection from "./CosPlansSection";
import { getMemberCOSPoints } from "@/src/utils/groups/COS/getMemberCOSPoints";
import { getSimple } from "@/src/utils/helpers/parser";

export default async function PlansSection({
  groupID,
  members,
  admins,
  curMemberID,
}: {
  groupID: string;
  members: string[];
  admins: string[];
  curMemberID: string;
}) {
  try {
    const { data, error } = await dbHandler.getSpecific({
      path: `GROUPS/${groupID}/COS`,
      orderCol: "month",
      ascending: true,
    });

    if (error) throw new Error(error);

    const cosData = getSimple(data);

    const { data: memberRes, error: memberError } = await getMemberCOSPoints(
      members
    );

    if (memberError) throw new Error(memberError);
    const memberPoints = getSimple(memberRes) as { [memberID: string]: number };

    return (
      <div className="w-full">
        <div className="flex items-center justify-between gap-2 w-full">
          <h1 className="text-lg font-bold text-custom-dark-text">
            Planned COS
          </h1>
          {admins.includes(curMemberID) && (
            <CreatePlanSection
              memberPoints={memberPoints}
              members={members}
              cosData={cosData}
              groupID={groupID}
            />
          )}
        </div>
        <HRow className="mb-2" />
        <CosPlansSection cosData={cosData} />
      </div>
    );
  } catch (err: any) {
    return ErrorScreenHandler(err);
  }
}
