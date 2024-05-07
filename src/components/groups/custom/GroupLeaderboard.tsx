import React from "react";
import { dbHandler } from "@/src/firebase/db";
import ErrorSection from "../../utils/ErrorSection";
import { GroupDetailsType } from "@/src/utils/schemas/groups";
import { getMemberPoints } from "@/src/utils/groups/leaderboard";
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
    const { data: scoreData, error: scoreError } = await getMemberPoints(
      groupMembers
    );

    if (scoreError) throw new Error(scoreError);

    const sortedScores = {} as GroupDetailsType;

    Object.keys(scoreData)
      .sort((a, b) => scoreData[b].points - scoreData[a].points)
      .filter((id: string) => scoreData[id].points > 0)
      .forEach((id: string) => {
        sortedScores[id] = scoreData[id];
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
