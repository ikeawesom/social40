import ComingSoonScreen from "@/src/components/screens/ComingSoonScreen";
import { dbHandler } from "@/src/firebase/db";
import ErrorScreenHandler from "@/src/components/ErrorScreenHandler";
import {
  DEFAULT_STATS,
  LEADERBOARD_CATS,
  LeaderboardCatType,
} from "@/src/utils/constants";
import {
  appendMemberPFP,
  calculateMembersScores,
  getMemberOverallPoints,
  getMembersCOSLeaderboardPoints,
} from "@/src/utils/groups/leaderboard";
import { GROUP_SCHEMA, GroupDetailsType } from "@/src/utils/schemas/groups";
import PodiumMember from "./PodiumMember";
import ErrorSection from "@/src/components/utils/ErrorSection";
import LeaderboardMember from "./LeaderboardMember";
import Link from "next/link";

export async function LeaderboardPageSection({
  groupID,
  type,
  filteredStats,
  curMember,
}: {
  groupID: string;
  type: string;
  filteredStats: LeaderboardCatType;
  curMember: string;
}) {
  if (type === "guard-duty") return <ComingSoonScreen />;

  try {
    const { error, data } = await dbHandler.getSpecific({
      path: `GROUPS/${groupID}/MEMBERS`,
      orderCol: "memberID",
      ascending: true,
    });

    if (error) throw new Error(error);

    const groupMembers = data as GroupDetailsType;

    let groupMembersScores = {} as GroupDetailsType;
    let podiumMembers = {} as GroupDetailsType;
    let remainingMembers = {} as GroupDetailsType;

    if (Object.keys(DEFAULT_STATS).includes(type)) {
      // IPPT, ATP, SOC, VOC
      const { error, data } = await calculateMembersScores(
        type,
        Object.keys(groupMembers)
      );
      if (error) throw new Error(error);
      Object.keys(data).forEach((id: string) => {
        groupMembersScores[id] = {
          ...groupMembers[id],
          points: data[id].score,
        };
      });
    } else if (type === "OVERALL") {
      const { data: scoreData, error: scoreError } =
        await getMemberOverallPoints(groupMembers);
      if (scoreError) throw new Error(scoreError);

      groupMembersScores = scoreData as GroupDetailsType;
    } else if (type === "COS") {
      const { error, data } = await getMembersCOSLeaderboardPoints(
        Object.keys(groupMembers)
      );
      if (error) throw new Error(error);
      const { error: groupErr, data: groupRes } = await dbHandler.get({
        col_name: "GROUPS",
        id: groupID,
      });
      if (groupErr) throw new Error(groupErr);
      const groupData = groupRes as GROUP_SCHEMA;
      const { cos } = groupData;
      if (!cos) throw new Error("This group does not enable COS");
      Object.keys(data).forEach((id: string) => {
        groupMembersScores[id] = {
          ...groupMembers[id],
          points: data[id].points,
        };
      });
    }

    const { data: scoresPFPRes, error: pfpErr } = await appendMemberPFP(
      groupMembersScores
    );
    if (pfpErr) throw new Error(pfpErr);
    const scoresPFP = scoresPFPRes as GroupDetailsType;

    const sortedScoresPfpFirst = Object.keys(scoresPFP).sort((a, b) =>
      filteredStats[type].timing
        ? (scoresPFP[a].points ?? 0) - (scoresPFP[b].points ?? 0)
        : (scoresPFP[b].points ?? 0) - (scoresPFP[a].points ?? 0)
    );

    const sortedScoresPfp = sortedScoresPfpFirst.filter((id: string) => {
      const score = scoresPFP[id].points ?? 0;
      return score > 0;
    });

    let topFewTemp = {} as { [id: string]: number };
    let topScores = [] as number[];
    let topFew = {} as { [id: string]: number };
    let lastIndex = 0;

    for (let i = 0; i < sortedScoresPfp.length; i++) {
      lastIndex = i;
      const memberID = sortedScoresPfp[i];
      const score = scoresPFP[memberID].points ?? 0;
      if (score > 0) {
        topFewTemp[memberID] = score;
        topScores.push(score);
      } else break;

      if (Object.keys(topFewTemp).length === 3) break;
    }

    if (Object.keys(topFewTemp).length > 1) {
      const first = Object.keys(topFewTemp)[0];
      const second = Object.keys(topFewTemp)[1];
      const newIDs = Object.keys(topFewTemp).filter(
        (id: string) => id !== first && id !== second
      );
      topFew[second] = topFewTemp[second];
      topFew[first] = topFewTemp[first];
      newIDs.forEach((id: string) => {
        topFew[id] = topFewTemp[id];
      });
    } else {
      Object.keys(topFewTemp).forEach((id: string) => {
        topFew[id] = topFewTemp[id];
      });
    }

    Object.keys(topFew).forEach((id: string) => {
      podiumMembers[id] = scoresPFP[id];
    });

    const emptyPodium = Object.keys(podiumMembers).length === 0;

    sortedScoresPfp
      .splice(lastIndex + 1, sortedScoresPfp.length)
      .forEach((id: string) => {
        remainingMembers[id] = scoresPFP[id];
      });

    const emptyMembers = Object.keys(remainingMembers).length === 0;

    return (
      <div className="flex-col flex w-full items-start justify-start gap-4">
        {/* Podium Section */}
        <div className="w-full flex items-center justify-evenly mt-6">
          {emptyPodium ? (
            <ErrorSection>
              Oops, looks like nobody here is qualified to be on the
              leaderboard!
            </ErrorSection>
          ) : (
            Object.keys(podiumMembers).map((id: string, index: number) => {
              const score = scoresPFP[id].points ?? 0;
              if (score) {
                let podiumType = "";
                if (score === topScores[0]) {
                  podiumType = "GOLD";
                } else if (score === topScores[1]) {
                  podiumType = "SILVER";
                } else {
                  podiumType = "BRONZE";
                }
                let scoreStr = "";
                if (LEADERBOARD_CATS[type].timing) {
                  scoreStr = `${Math.floor(score / 60)}min ${score % 60}sec`;
                } else {
                  scoreStr = `${score}`;
                }
                return (
                  <PodiumMember
                    key={index}
                    type={podiumType}
                    scoreStr={scoreStr}
                    member={JSON.parse(JSON.stringify(scoresPFP[id]))}
                  />
                );
              }
            })
          )}
        </div>

        {type === "OVERALL" && (
          <Link
            className="text-sm underline text-custom-grey-text hover:text-custom-primary duration-150"
            target="_blank"
            href="https://social40.notion.site/v1-4-0-Leaderboard-566f1d15044d4ff88382b4a2e010caa2"
          >
            How is this overall score calculated?
          </Link>
        )}
        {/* Remaining */}
        <div className="w-full flex items-start justify-start gap-2 flex-col">
          {Object.keys(remainingMembers).map((id: string) => {
            return (
              <LeaderboardMember
                key={id}
                curMember={curMember}
                member={scoresPFP[id]}
              />
            );
          })}
          {emptyMembers && !emptyPodium && (
            <ErrorSection>
              Welp, I guess nobody else participated in {type}!
            </ErrorSection>
          )}
        </div>
      </div>
    );
  } catch (err: any) {
    return ErrorScreenHandler(err);
  }
}
