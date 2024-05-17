import AllActivities from "@/src/components/groups/custom/activities/AllActivities";
import HeaderBar from "@/src/components/navigation/HeaderBar";
import PageCenterWrapper from "@/src/components/utils/PageCenterWrapper";
import { dbHandler } from "@/src/firebase/db";
import ErrorScreenHandler from "@/src/components/ErrorScreenHandler";
import { GROUP_ACTIVITY_SCHEMA } from "@/src/utils/schemas/group-activities";
import { getMemberAuthServer } from "@/src/utils/auth/handleServerAuth";

export default async function GroupPage({
  params,
}: {
  params: { [groupID: string]: string };
}) {
  const { user, isAuthenticated } = await getMemberAuthServer();
  if (!isAuthenticated || user === null) return;
  const { memberID } = user;
  const groupID = params.groupID;

  const res = await dbHandler.getSpecific({
    path: `GROUPS/${groupID}/GROUP-ACTIVITIES`,
    orderCol: "activityDate",
    ascending: false,
  });

  if (!res.status) return ErrorScreenHandler(res.error);

  const groupActivities = res.data as {
    [groupID: string]: GROUP_ACTIVITY_SCHEMA;
  };

  return (
    <>
      <HeaderBar back text={`Activities`} />
      <PageCenterWrapper>
        <AllActivities
          activities={JSON.parse(JSON.stringify(groupActivities))}
          memberID={memberID}
        />
      </PageCenterWrapper>
    </>
  );
}
