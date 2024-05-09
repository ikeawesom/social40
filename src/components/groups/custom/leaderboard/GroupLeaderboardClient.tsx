"use client";

import SecondaryButton from "@/src/components/utils/SecondaryButton";
import { GROUP_ROLES_HEIRARCHY } from "@/src/utils/constants";
import { GroupDetailsType } from "@/src/utils/schemas/groups";
import React, { useEffect, useState } from "react";
import LeaderboardTab from "./LeaderboardTab";
import LeaderboardTabSkeleton from "./LeaderboardTabSkeleton";
import Link from "next/link";
import ErrorSection from "@/src/components/utils/ErrorSection";

type ScoreCatType = "ALL" | "COMMANDERS" | "MEMBERS";
const ScoreCat = ["ALL", "COMMANDERS", "MEMBERS"];
export default function GroupLeaderboardClient({
  curMember,
  scores,
  groupID,
  admin,
}: {
  scores: GroupDetailsType;
  curMember: string;
  admin: boolean;
  groupID: string;
}) {
  const [cat, setCat] = useState<ScoreCatType | string>("ALL");
  const [top, setTop] = useState<GroupDetailsType>();

  useEffect(() => {
    if (cat === "ALL") {
      setTop(scores);
    } else if (cat === "COMMANDERS") {
      let temp = {} as GroupDetailsType;
      Object.keys(scores)
        .filter((id: string) => {
          const role = scores[id].role;
          return (
            GROUP_ROLES_HEIRARCHY[role].rank >=
            GROUP_ROLES_HEIRARCHY["admin"].rank
          );
        })
        .forEach((id: string) => {
          temp[id] = scores[id];
        });
      setTop(temp);
    } else if (cat === "MEMBERS") {
      let temp = {} as GroupDetailsType;
      Object.keys(scores)
        .filter((id: string) => {
          const role = scores[id].role;
          return role === "member";
        })
        .forEach((id: string) => {
          temp[id] = scores[id];
        });
      setTop(temp);
    }
  }, [cat]);

  //   let sortedTop = top;

  //   if (sortedTop && top) {
  //     let temp = {} as GroupDetailsType;

  //     const [first, second, third] = Object.keys(top).splice(0, 3);
  //     temp[second] = top[second];
  //     temp[first] = top[first];
  //     temp[third] = top[third];

  //     sortedTop = temp;
  //   }

  if (top !== undefined) {
    let filtered = [] as string[];
    filtered = Object.keys(top).splice(0, 3);
    const curMemberPoints = top[curMember] ? top[curMember].points ?? 0 : 0;

    return (
      <div className="w-full flex items-start justify-start flex-col gap-0 mt-2">
        <div className="w-full flex items-center justify-center rounded-md overflow-hidden shadow-sm border-[1px] border-custom-light-text">
          {ScoreCat.map((type: string, id: number) => (
            <SecondaryButton
              onClick={() => setCat(type)}
              className="rounded-none shadow-none border-none px-3 border-l-[1px]"
              activatedStyles="bg-custom-primary text-custom-light-text font-bold"
              activated={type === cat}
              key={id}
            >
              {type}
            </SecondaryButton>
          ))}
        </div>

        {top !== undefined && filtered.length > 0 ? (
          <>
            <div className="w-full flex items-start justify-start gap-2 flex-col mt-4">
              <LeaderboardTab
                curMember={curMember}
                type={"GOLD"}
                member={top[filtered[0]]}
              />
              <LeaderboardTab
                curMember={curMember}
                type={"SILVER"}
                member={top[filtered[1]]}
              />
              <LeaderboardTab
                curMember={curMember}
                type={"BRONZE"}
                member={top[filtered[2]]}
              />
            </div>
            {!filtered.includes(curMember) &&
              ((admin && cat !== "MEMBERS") || (!admin && cat === "MEMBERS")) &&
              curMemberPoints > 0 && (
                <div className="w-full flex-col items-center justify-center">
                  <p className="text-center text-custom-grey-text">:</p>
                  <LeaderboardTab
                    type="DEFAULT"
                    className="shadow-sm border-[1px] border-custom-light-text/50 hover:bg-custom-light-text/70"
                    curMember={curMember}
                    member={top[curMember]}
                  />
                </div>
              )}
          </>
        ) : filtered.length === 0 ? (
          <ErrorSection>
            Oops, looks like nobody here is qualified on the leaderboard!
          </ErrorSection>
        ) : (
          <div className="flex flex-col w-full items-start justify-start gap-3 mt-4">
            <LeaderboardTabSkeleton isBest />
            <LeaderboardTabSkeleton />
            <LeaderboardTabSkeleton />
          </div>
        )}
        <Link
          className="text-start underline text-sm duration-150 text-custom-grey-text hover:text-custom-primary mt-3"
          href={`/groups/${groupID}/leaderboard`}
        >
          View all leaderboards
        </Link>
      </div>
    );
  }
}
