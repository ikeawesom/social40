import { MEMBER_SCHEMA } from "@/src/utils/schemas/members";
import React from "react";
import ComingSoonCard from "../../utils/ComingSoonCard";

export type MembersDataType = {
  [memberID: string]: MEMBER_SCHEMA;
};

export type LeaderboardType = {
  memberData: { [memberID: string]: MEMBER_SCHEMA };
};

export default function GroupLeaderboard({ memberData }: LeaderboardType) {
  return <ComingSoonCard text="Leaderboard" />;
}
