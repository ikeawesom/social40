import { MEMBER_SCHEMA } from "@/src/utils/schemas/members";
import React from "react";
import DefaultCard from "../../DefaultCard";
import HRow from "../../utils/HRow";
import ComingSoonIcon from "../../utils/ComingSoonIcon";

export type MembersDataType = {
  [memberID: string]: MEMBER_SCHEMA;
};

export type LeaderboardType = {
  memberData: { [memberID: string]: MEMBER_SCHEMA };
};

export default function GroupLeaderboard({ memberData }: LeaderboardType) {
  return (
    <DefaultCard className="w-full">
      <h1 className="text-custom-dark-text font-semibold">Leaderboard</h1>
      <HRow />
      <div className="p-3">
        <ComingSoonIcon className="gap-2" small width={100} height={100} />
      </div>
    </DefaultCard>
  );
}
