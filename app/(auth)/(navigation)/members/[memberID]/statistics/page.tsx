import { StatisticFeed } from "@/src/components/members/statistics/feed/StatisticFeed";
import StatisticSkeleton from "@/src/components/members/statistics/StatisticSkeleton";
import StatsScrollSection from "@/src/components/members/statistics/StatsScrollSection";
import HeaderBar from "@/src/components/navigation/HeaderBar";
import SignInAgainScreen from "@/src/components/screens/SignInAgainScreen";
import PageCenterWrapper from "@/src/components/utils/PageCenterWrapper";
import { dbHandler } from "@/src/firebase/db";
import ErrorScreenHandler from "@/src/components/ErrorScreenHandler";
import { cookies } from "next/headers";
import { Suspense } from "react";

export default async function MemberPage({
  params,
  searchParams,
}: {
  params: { memberID: string };
  searchParams: { type: string };
}) {
  const clickedMemberID = params.memberID;
  const cookieStore = cookies();

  const cookieData = cookieStore.get("memberID");

  if (!cookieData) return <SignInAgainScreen />;

  try {
    const memberID = cookieData.value;

    const { error } = await dbHandler.get({
      col_name: "MEMBERS",
      id: memberID,
    });
    if (error) throw new Error(error);

    const statType = searchParams.type ?? "IPPT";

    return (
      <>
        <HeaderBar text={`${clickedMemberID}'s Statistics`} back />
        <PageCenterWrapper className="flex flex-col items-stretch justify-start gap-2">
          <StatsScrollSection id={clickedMemberID} />
          <Suspense key={statType} fallback={<StatisticSkeleton />}>
            <StatisticFeed id={clickedMemberID} type={statType} />
          </Suspense>
        </PageCenterWrapper>
      </>
    );
  } catch (err: any) {
    return ErrorScreenHandler(err);
  }
}
