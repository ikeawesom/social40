import MonthlyPlanList from "@/src/components/groups/custom/cos/plans/MonthlyPlanList";
import HeaderBar from "@/src/components/navigation/HeaderBar";
import RestrictedScreen from "@/src/components/screens/RestrictedScreen";
import PageCenterWrapper from "@/src/components/utils/PageCenterWrapper";
import { dbHandler } from "@/src/firebase/db";
import ErrorScreenHandler from "@/src/components/ErrorScreenHandler";
import { getMemberCOSPoints } from "@/src/utils/groups/COS/getMemberCOSPoints";
import { COS_DAILY_SCHEMA, CosDailyType } from "@/src/utils/schemas/cos";
import { GROUP_SCHEMA } from "@/src/utils/schemas/groups";
import { Metadata } from "next";
import { getMemberAuthServer } from "@/src/utils/auth/handleServerAuth";

export const metadata: Metadata = {
  title: "COS",
};

export default async function GroupsMonthlyCOSPage({
  params,
}: {
  params: { [groupID: string]: string };
}) {
  const { user, isAuthenticated } = await getMemberAuthServer();
  if (!isAuthenticated || user === null) return;
  const { memberID } = user;

  try {
    const groupID = params.groupID;
    // check if group exists
    const { data, error: groupError } = await dbHandler.get({
      col_name: "GROUPS",
      id: groupID,
    });
    if (groupError) throw new Error(groupError);

    const groupData = data as GROUP_SCHEMA;
    const { cos } = groupData;
    if (!cos) return <RestrictedScreen />;

    const { members, state, admins } = cos;
    if (!state || (!members.includes(memberID) && !admins.includes(memberID)))
      return <RestrictedScreen />;

    const month = params.month;

    const { data: monthlyCOSRes, error } = await dbHandler.get({
      col_name: `GROUPS/${groupID}/COS`,
      id: month,
    });

    if (error) throw new Error(error);

    const monthCOSData = monthlyCOSRes as COS_DAILY_SCHEMA;
    const { plans, confirmed, membersOriginalScores } = monthCOSData;

    const sortedPlansArr = Object.keys(plans).sort(
      (a: string, b: string) => plans[a].day - plans[b].day
    );
    const sortedPlans = {} as { [date: string]: CosDailyType };
    sortedPlansArr.forEach((date: string) => {
      sortedPlans[date] = plans[date];
    });

    const { data: memberRes, error: memberError } = await getMemberCOSPoints(
      members
    );

    if (memberError) throw new Error(memberError);
    const memberPoints = memberRes as { [memberID: string]: number };

    return (
      <>
        <HeaderBar back text={`COS Plan for ${groupID}`} />
        <PageCenterWrapper className="flex flex-col items-start justify-start gap-4">
          <MonthlyPlanList
            membersOriginalScores={membersOriginalScores}
            confirmed={confirmed ?? false}
            memberPoints={memberPoints}
            sortedPlans={sortedPlans}
            groupData={groupData}
            month={month}
          />
        </PageCenterWrapper>
      </>
    );
  } catch (err: any) {
    return ErrorScreenHandler(err);
  }
}
