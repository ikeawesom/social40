import DefaultCard from "@/src/components/DefaultCard";
import HRow from "@/src/components/utils/HRow";
import { dbHandler } from "@/src/firebase/db";
import { HA_REPORT_SCHEMA } from "@/src/utils/schemas/ha";
import Link from "next/link";
import React from "react";
import { twMerge } from "tailwind-merge";
import CalculateHAButton from "./CalculateHAButton";

export default async function GroupHAServerSection({
  groupID,
}: {
  groupID: string;
}) {
  const { error, data: membersList } = await dbHandler.getSpecific({
    path: `GROUPS/${groupID}/MEMBERS`,
    orderCol: "dateJoined",
    ascending: false,
  });

  if (error) throw new Error(error);

  const { data: reports, error: reportsError } = await dbHandler.getSpecific({
    path: `GROUPS/${groupID}/HA-REPORTS`,
    orderCol: "createdOn",
    ascending: false,
  });

  if (reportsError) throw new Error(reportsError);

  const empty = Object.keys(reports).length === 0;
  return (
    <>
      {empty && (
        <>
          <h1 className="text-2xl font-bold text-custom-dark-text mt-3">
            No group reports created.
          </h1>
          <p className="text-custom-grey-text mb-4"> Start cooking one now!</p>
        </>
      )}
      <CalculateHAButton
        className={twMerge(empty ? "w-fit" : "w-full mt-2")}
        groupID={groupID}
        membersList={JSON.parse(JSON.stringify(membersList))}
      />

      {!empty && <HRow />}
      {Object.keys(reports).map((id: string) => {
        const data = reports[id] as HA_REPORT_SCHEMA;
        const { time, members, reportID } = data;
        const HAmembers = members.filter((member) => member.isHA);
        return (
          <Link
            scroll={false}
            key={reportID}
            href={`/groups/${groupID}/HA-report/${reportID}`}
            className="w-full"
          >
            <DefaultCard className="w-full duration-150 hover:bg-custom-light-text items-start justify-start flex flex-col px-3 py-2">
              <h1 className="text-lg">
                <span className="font-bold text-custom-primary">
                  {HAmembers.length}
                </span>{" "}
                HA personnel
              </h1>
              <p className="text-xs text-custom-grey-text">
                Last updated: {time.to}
              </p>
            </DefaultCard>
          </Link>
        );
      })}
    </>
  );
}
