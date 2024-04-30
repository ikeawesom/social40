import PlansSection from "@/src/components/groups/custom/cos/plans/PlansSection";
import COSMembersSection from "@/src/components/groups/custom/cos/members/COSMembersSection";
import HeaderBar from "@/src/components/navigation/HeaderBar";
import RestrictedScreen from "@/src/components/screens/RestrictedScreen";
import SignInAgainScreen from "@/src/components/screens/SignInAgainScreen";
import DefaultSkeleton from "@/src/components/utils/DefaultSkeleton";
import { dbHandler } from "@/src/firebase/db";
import ErrorScreenHandler from "@/src/utils/ErrorScreenHandler";
import { GROUP_SCHEMA } from "@/src/utils/schemas/groups";
import { Metadata } from "next";
import { cookies } from "next/headers";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "COS",
};

export default async function GroupCOSPage({
  params,
}: {
  params: { [groupID: string]: string };
}) {
  const cookieStore = cookies();

  const data = cookieStore.get("memberID");

  if (!data) return <SignInAgainScreen />;

  const memberID = data.value;
  if (!memberID) return <SignInAgainScreen />;

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

    return (
      <>
        <HeaderBar text={`COS Plan for ${groupID}`} back />
        <div className="grid place-items-center">
          <div className="max-w-[500px] w-full flex flex-col items-start justify-start gap-4">
            <Suspense fallback={<DefaultSkeleton className="h-[30vh]" />}>
              <PlansSection
                groupID={groupID}
                members={groupData.cos?.members ?? []}
              />
            </Suspense>
            <Suspense fallback={<DefaultSkeleton className="h-[50vh]" />}>
              <COSMembersSection
                groupData={groupData}
                admins={admins}
                members={groupData.cos?.members ?? []}
              />
            </Suspense>
          </div>
        </div>
      </>
    );
  } catch (err: any) {
    return ErrorScreenHandler(err);
  }
}
