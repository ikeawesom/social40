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
import PageCenterWrapper from "@/src/components/utils/PageCenterWrapper";

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
        <PageCenterWrapper className="flex flex-col items-start justify-start gap-4">
          <Suspense
            fallback={
              <div className="flex flex-col w-full items-start justify-start gap-2">
                <DefaultSkeleton className="h-[30px] max-w-[150px]" />
                <DefaultSkeleton className="h-[14vh]" />
              </div>
            }
          >
            <PlansSection
              curMemberID={memberID}
              groupID={groupID}
              members={cos.members ?? []}
              admins={admins}
            />
          </Suspense>
          <Suspense
            fallback={
              <div className="flex flex-col w-full items-start justify-start gap-2">
                <DefaultSkeleton className="h-[30px] max-w-[150px]" />
                <DefaultSkeleton className="h-[15px]" />
                <DefaultSkeleton className="h-[15px]" />
                <DefaultSkeleton className="h-[15px]" />
              </div>
            }
          >
            <COSMembersSection
              curMemberID={memberID}
              groupData={JSON.parse(JSON.stringify(groupData))}
              admins={admins}
              members={cos.members ?? []}
            />
          </Suspense>
        </PageCenterWrapper>
      </>
    );
  } catch (err: any) {
    return ErrorScreenHandler(err);
  }
}
