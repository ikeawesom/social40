import HRow from "@/src/components/utils/HRow";
import { dbHandler } from "@/src/firebase/db";
import ErrorScreenHandler from "@/src/utils/ErrorScreenHandler";
import { COS_MONTHLY_SCHEMA } from "@/src/utils/schemas/cos";
import React from "react";
import CreatePlanSection from "./CreatePlanSection";
import CosPlansSection from "./CosPlansSection";
import { getMemberPoints } from "@/src/utils/groups/COS/getMemberPoints";

export default async function PlansSection({
  groupID,
  members,
}: {
  groupID: string;
  members: string[];
}) {
  try {
    const { data, error } = await dbHandler.getSpecific({
      path: `GROUPS/${groupID}/COS`,
      orderCol: "month",
      ascending: true,
    });

    if (error) throw new Error(error);

    const cosData = data as COS_MONTHLY_SCHEMA;

    const { data: memberRes, error: memberError } = await getMemberPoints(
      members
    );

    if (memberError) throw new Error(memberError);
    const memberPoints = memberRes as { [memberID: string]: number };

    return (
      <div className="w-full">
        <div className="flex items-center justify-between gap-2 w-full">
          <h1 className="text-lg font-bold text-custom-dark-text">
            Planned COS
          </h1>
          <CreatePlanSection
            memberPoints={memberPoints}
            members={members}
            cosData={cosData}
            groupID={groupID}
          />
        </div>
        <HRow className="mb-2" />
        <CosPlansSection cosData={cosData} />
      </div>
    );
  } catch (err: any) {
    return ErrorScreenHandler(err);
  }
}
