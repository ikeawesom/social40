import React from "react";
import { dbHandler } from "@/src/firebase/db";
import ErrorSection from "../../utils/ErrorSection";
import { GroupDetailsType } from "@/src/utils/schemas/groups";
import {
  appendMemberPFP,
  getMemberOverallPoints,
} from "@/src/utils/groups/leaderboard";
import GroupLeaderboardClient from "./leaderboard/GroupLeaderboardClient";

export default async function GroupLeaderboard({
  admin,
  groupID,
  curMember,
}: {
  admin: boolean;
  groupID: string;
  curMember: string;
}) {
  try {
    const { error, data } = await dbHandler.getSpecific({
      path: `GROUPS/${groupID}/MEMBERS`,
      orderCol: "memberID",
      ascending: true,
    });
    if (error) throw new Error(error);

    const groupMembers = data as GroupDetailsType;
    const { data: scoreData, error: scoreError } = await getMemberOverallPoints(
      groupMembers
    );
    if (scoreError) throw new Error(scoreError);

    const { data: sortedPFPScoresRes, error: pfpErr } = await appendMemberPFP(
      scoreData
    );

    if (pfpErr) throw new Error(pfpErr);

    const sortedScores = {} as GroupDetailsType;

    Object.keys(sortedPFPScoresRes)
      .sort(
        (a, b) => sortedPFPScoresRes[b].points - sortedPFPScoresRes[a].points
      )
      .filter((id: string) => sortedPFPScoresRes[id].points > 0)
      .forEach((id: string) => {
        sortedScores[id] = sortedPFPScoresRes[id];
      });

    return (
      <GroupLeaderboardClient
        groupID={groupID}
        admin={admin}
        curMember={curMember}
        scores={JSON.parse(JSON.stringify(sortedScores))}
      />
    );
  } catch (err: any) {
    return <ErrorSection errorMsg={err.message} />;
  }
}
