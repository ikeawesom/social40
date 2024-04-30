import DefaultCard from "@/src/components/DefaultCard";
import PrimaryButton from "@/src/components/utils/PrimaryButton";
import { dbHandler } from "@/src/firebase/db";
import { DateToString } from "@/src/utils/getCurrentDate";
import { COS_DAILY_SCHEMA } from "@/src/utils/schemas/cos";
import Link from "next/link";
import React from "react";

export default async function CosSection({
  groupID,
  curMemberID,
  cos,
}: {
  groupID: string;
  curMemberID: string;
  cos: {
    state: boolean;
    admins: string[];
    members: string[];
  };
}) {
  try {
    const date = new Date();
    date.setHours(date.getHours() + 8);
    const dateStr = DateToString(date).split(" ")[0];

    const month = date.getMonth(); // 0: jan, 1: feb, 2: march, etc.
    const { data, error } = await dbHandler.get({
      col_name: `GROUPS/${groupID}/COS`,
      id: `${month}`,
    });

    if (error && !error.includes("not found")) throw new Error(error);

    let cosData = data as COS_DAILY_SCHEMA | null;

    return (
      <DefaultCard className="w-full">
        {!cosData ? (
          (cos.admins.includes(curMemberID) ||
            cos.members.includes(curMemberID)) && (
            <div className="flex w-full items-start justify-center flex-col gap-2">
              <p className="text-sm text-custom-grey-text">
                Hmm.. you do not have a COS planned for today, {dateStr}.
              </p>
              {cos.admins.includes(curMemberID) ? (
                <Link href={`/groups/${groupID}/COS`}>
                  <PrimaryButton className="w-fit">
                    Start Planning
                  </PrimaryButton>
                </Link>
              ) : (
                <Link
                  href={`/groups/${groupID}/COS`}
                  className="text-xs underline text-custom-primary hover:opacity-70"
                >
                  View COS Plans
                </Link>
              )}
            </div>
          )
        ) : (
          <div className="flex flex-col items-start justify-start gap-1">
            <p className="text-xs text-custom-grey-text">
              COS for today, {dateStr}
            </p>
            <h1 className="font-bold text-custom-dark-text">
              {cosData.plans[dateStr].memberID}
            </h1>
            {(cos.admins.includes(curMemberID) ||
              cos.members.includes(curMemberID)) && (
              <Link
                href={`/groups/${groupID}/COS`}
                className="text-xs underline text-custom-primary hover:opacity-70"
              >
                View COS Plans
              </Link>
            )}
          </div>
        )}
      </DefaultCard>
    );
  } catch (err: any) {
    console.log(`[COS] ${err.message}`);
  }
}
