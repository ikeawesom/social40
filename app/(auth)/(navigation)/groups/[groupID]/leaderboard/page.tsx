import { LeaderboardPageSection } from "@/src/components/groups/custom/leaderboard/LeaderboardPageSection";
import LeaderboardPageSkeleton from "@/src/components/groups/custom/leaderboard/LeaderboardPageSkeleton";
import LeaderboardScollSection from "@/src/components/groups/custom/leaderboard/LeaderboardScollSection";
import HeaderBar from "@/src/components/navigation/HeaderBar";
import SignInAgainScreen from "@/src/components/screens/SignInAgainScreen";
import PageCenterWrapper from "@/src/components/utils/PageCenterWrapper";
import { dbHandler } from "@/src/firebase/db";
import ErrorScreenHandler from "@/src/utils/ErrorScreenHandler";
import { LEADERBOARD_CATS, LeaderboardCatType } from "@/src/utils/constants";
import { isMemberInGroup } from "@/src/utils/groups/getGroupData";
import { GROUP_SCHEMA } from "@/src/utils/schemas/groups";
import { Metadata } from "next";
import { cookies } from "next/headers";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Leaderboard",
};

export default async function LeaderboardPage({
  params,
  searchParams,
}: {
  params: { [groupID: string]: string };
  searchParams: { type: string };
}) {
  const groupID = params.groupID;
  const cookieStore = cookies();

  const data = cookieStore.get("memberID");
  if (!data) return <SignInAgainScreen />;
  const memberID = data.value;

  try {
    const { error: memberErr } = await isMemberInGroup(groupID, memberID);
    if (memberErr) throw new Error(memberErr);

    const leaderboardType = searchParams.type ?? "OVERALL";

    const { data } = await dbHandler.get({ col_name: "GROUPS", id: groupID });
    const groupData = data as GROUP_SCHEMA;

    let filteredStats = {} as LeaderboardCatType;
    const { cos } = groupData;

    if (!cos) {
      const temp = Object.keys(LEADERBOARD_CATS).filter(
        (type: string) => type !== "COS"
      );
      temp.forEach((type: string) => {
        filteredStats[type] = LEADERBOARD_CATS[type];
      });
    } else {
      filteredStats = LEADERBOARD_CATS;
    }

    return (
      <>
        <HeaderBar back text="Leaderboard" />
        <PageCenterWrapper className="overflow-x-hidden flex-col flex w-full items-start justify-start gap-4">
          <LeaderboardScollSection
            groupID={groupID}
            filteredStats={filteredStats}
          />
          <Suspense
            key={leaderboardType}
            fallback={<LeaderboardPageSkeleton />}
          >
            <LeaderboardPageSection
              curMember={memberID}
              filteredStats={filteredStats}
              groupID={groupID}
              type={leaderboardType}
            />
          </Suspense>
        </PageCenterWrapper>
      </>
    );
  } catch (err: any) {
    return ErrorScreenHandler(err);
  }
}
