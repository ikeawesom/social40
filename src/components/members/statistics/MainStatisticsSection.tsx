import Link from "next/link";
import React, { Suspense } from "react";
import AddMemberStatForm from "./AddMemberStatForm";
import StatisticsSection from "./StatisticsSection";
import StatsLoading from "./StatsLoading";

export default async function MainStatisticsSection({
  curID,
  clickedMemberID,
  permission,
}: {
  curID: string;
  clickedMemberID: string;
  permission?: boolean;
}) {
  return (
    <div className="flex items-center justify-center gap-1 w-full flex-col">
      <h1 className="text-custom-dark-text font-bold mb-1">Best Statistics</h1>
      <Suspense fallback={<StatsLoading />}>
        <StatisticsSection id={clickedMemberID} />
      </Suspense>
      <div className="w-full items-center justify-end flex mt-2 gap-4">
        <Link
          href={`/members/${clickedMemberID}/statistics`}
          className="text-sm underline text-custom-grey-text hover:text-custom-primary"
        >
          View All
        </Link>
        {permission && <AddMemberStatForm id={clickedMemberID} curID={curID} />}
      </div>
    </div>
  );
}
