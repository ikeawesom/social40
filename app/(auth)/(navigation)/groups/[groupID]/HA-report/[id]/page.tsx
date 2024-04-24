import DeleteHAButton from "@/src/components/groups/custom/HA/DeleteHAButton";
import HATabs from "@/src/components/groups/custom/HA/HATabs";
import HeaderBar from "@/src/components/navigation/HeaderBar";
import { dbHandler } from "@/src/firebase/db";
import ErrorScreenHandler from "@/src/utils/ErrorScreenHandler";
import { HA_REPORT_SCHEMA } from "@/src/utils/schemas/ha";
import React from "react";

export default async function ReportPage({
  params,
}: {
  params: { [id: string]: string };
}) {
  const groupID = params.groupID;
  const reportID = params.id;

  try {
    const { data: report }: { data: HA_REPORT_SCHEMA } = await dbHandler.get({
      col_name: `GROUPS/${groupID}/HA-REPORTS`,
      id: reportID,
    });
    const { time, members } = report;
    const HAmembers = members.filter((member) => member.isHA);
    const normalMembers = members.filter((member) => !member.isHA);

    return (
      <>
        <HeaderBar back text={`HA Reports for ${groupID}`} />
        <div className="w-full flex items-start justify-center">
          <div className="flex flex-col w-full items-start justify-start gap-2 max-w-[550px]">
            <div className="mt-4 w-full flex flex-col items-center justify-center gap-1 text-center">
              <h1 className="text-xl">
                You have{" "}
                <span className="font-bold text-3xl text-custom-primary">
                  {HAmembers.length}
                </span>{" "}
                HA personnel.
              </h1>
              <p className="text-sm text-custom-grey-text">
                Calculated from: {time.from} <br /> Last updated: {time.to}
              </p>
            </div>
            <DeleteHAButton groupID={groupID} reportID={reportID} />
            <HATabs HAmembers={HAmembers} normalMembers={normalMembers} />
            <p className="text-center text-xs text-custom-grey-text self-center mt-3">
              Report ID: {reportID}
            </p>
          </div>
        </div>
      </>
    );
  } catch (err: any) {
    return ErrorScreenHandler(err);
  }
}
