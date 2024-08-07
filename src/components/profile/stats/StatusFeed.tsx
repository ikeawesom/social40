import React, { Suspense } from "react";
import { GetPostObj } from "@/src/utils/API/GetPostObj";
import { StatusListType } from "../StatsSection";
import ActiveStatusesSection from "./status/ActiveStatusesSection";
import HRow from "../../utils/HRow";
import RecentStatusesSection from "./status/RecentStatusesSection";
import { getSimple } from "@/src/utils/helpers/parser";
import StatusOverviewSection from "./status/StatusOverviewSection";
import OverviewSkeleton from "../OverviewSkeleton";
import { getMemberAuthServer } from "@/src/utils/auth/handleServerAuth";
import AltAddStatus from "../../status/AltAddStatus";

export default async function StatusFeed({
  viewProfile,
  memberID,
}: {
  viewProfile?: boolean;
  memberID: string;
}) {
  const { user } = await getMemberAuthServer();
  if (!user) return;
  const { memberID: alt } = user;

  const host = process.env.HOST;
  // fetch statuses from member
  const PostObjA = GetPostObj({
    memberID,
  });
  const resB = await fetch(`${host}/api/profile/status`, PostObjA);
  const dataB = await resB.json();

  if (!dataB.status) throw new Error(dataB.error);

  const status = dataB.data as StatusListType;
  const parsed = getSimple(status) as StatusListType;

  return (
    <div className="flex items-start justify-start flex-col w-full gap-4">
      {viewProfile && (
        <>
          <Suspense fallback={<OverviewSkeleton />}>
            <StatusOverviewSection memberID={memberID} statuses={parsed} />
          </Suspense>
          <AltAddStatus alt={alt} memberID={memberID} />
          <ActiveStatusesSection
            status={parsed}
            viewProfile={viewProfile ?? false}
          />
          <HRow className="bg-custom-grey-text/50" />
        </>
      )}
      <RecentStatusesSection
        status={parsed}
        viewProfile={viewProfile ?? false}
      />
    </div>
  );
}
