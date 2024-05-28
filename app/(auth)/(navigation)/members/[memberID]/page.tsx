import DefaultCard from "@/src/components/DefaultCard";
import BookedStatus from "@/src/components/members/BookedStatus";
import MemberBadges from "@/src/components/members/MemberBadges";
import PermissionForm from "@/src/components/members/PermissionForm";
import ResetPasswordButton from "@/src/components/members/ResetPasswordButton";
import HeaderBar from "@/src/components/navigation/HeaderBar";
import JoinedActivities from "@/src/components/profile/activities/JoinedActivities";
import StatusFeed from "@/src/components/profile/stats/StatusFeed";
import DefaultSkeleton from "@/src/components/utils/DefaultSkeleton";
import { GetPostObj } from "@/src/utils/API/GetPostObj";
import ErrorScreenHandler from "@/src/components/ErrorScreenHandler";
import { ROLES_HIERARCHY } from "@/src/utils/constants";
import { MEMBER_SCHEMA } from "@/src/utils/schemas/members";
import React, { Suspense } from "react";
import Image from "next/image";
import HRow from "@/src/components/utils/HRow";
import MainStatisticsSection from "@/src/components/members/statistics/MainStatisticsSection";
import PageCenterWrapper from "@/src/components/utils/PageCenterWrapper";
import { MemberHASection } from "@/src/components/members/HA/MemberHASection";
import { TimestampToDateString } from "@/src/utils/helpers/getCurrentDate";
import { getMemberAuthServer } from "@/src/utils/auth/handleServerAuth";
import MemberTabs from "@/src/components/members/MemberTabs";
import ErrorSection from "@/src/components/utils/ErrorSection";

export async function generateMetadata({
  params,
}: {
  params: { memberID: string };
}) {
  const member = params.memberID;
  return {
    title: member,
  };
}

export default async function MemberPage({
  params,
  searchParams,
}: {
  params: { memberID: string };
  searchParams: { view: string };
}) {
  const clickedMemberID = params.memberID;
  const { user, isAuthenticated } = await getMemberAuthServer();
  if (!isAuthenticated || user === null) return;
  const { memberID } = user;
  const host = process.env.HOST;
  const view = searchParams.view ?? "activities";

  try {
    // fetch current member data from server
    const PostObj = GetPostObj({
      memberID,
    });

    const res = await fetch(`${host}/api/profile/member`, PostObj);
    const data = await res.json();

    if (!data.status) throw new Error(data.error);

    const currentMemberData = data.data as MEMBER_SCHEMA;
    const { role } = currentMemberData;

    // fetch clicked member data from server
    const PostObjA = GetPostObj({
      memberID: clickedMemberID,
    });

    const resA = await fetch(`${host}/api/profile/member`, PostObjA);
    const dataA = await resA.json();

    if (!dataA.status) throw new Error(dataA.error);

    const viewMemberData = dataA.data as MEMBER_SCHEMA;
    const rankName =
      `${viewMemberData.rank} ${viewMemberData.displayName}`.trim();
    const pfp = viewMemberData.pfp;

    // get roles
    const sameMember = viewMemberData.memberID === currentMemberData.memberID;
    const permission =
      ROLES_HIERARCHY[role].rank >= ROLES_HIERARCHY["commander"].rank;
    const higher =
      ROLES_HIERARCHY[role].rank >= ROLES_HIERARCHY[viewMemberData.role].rank;
    const normalMember = role === "member";

    // get permissions
    const canViewStatus = permission || sameMember;
    const canViewPerms = higher && !sameMember && !normalMember;

    return (
      <>
        <HeaderBar text={clickedMemberID} back />
        <PageCenterWrapper className="flex flex-col items-stretch justify-start gap-4">
          <DefaultCard className="flex flex-col items-start justify-center gap-2">
            {pfp && (
              <div className="w-full flex items-center justify-center py-2 relative rounded-lg mb-1 overflow-hidden">
                <Image
                  src={pfp}
                  fill
                  sizes="100%"
                  alt="Profile"
                  className="object-cover brightness-50 hover:brightness-75 duration-150"
                />
                <div className="overflow-hidden rounded-full shadow-2xl sm:w-40 sm:h-40 w-32 h-32 relative flex items-center justify-center">
                  <Image
                    src={pfp}
                    fill
                    sizes="100%"
                    alt="Profile"
                    className="object-cover"
                  />
                </div>
              </div>
            )}
            {/* <div className="flex w-full items-center justify-between">
                <MemberPoints points={viewMemberData.points} />
              </div> */}
            <div className="flex flex-col items-start justify-center">
              <h1 className="text-xl text-custom-dark-text flex items-center justify-start gap-2">
                {rankName} <BookedStatus status={viewMemberData.bookedIn} />
              </h1>
              <p className="text-sm text-custom-grey-text">
                {viewMemberData.memberID}
              </p>
              {sameMember && (
                <p className="text-sm text-custom-grey-text">
                  Created on: {TimestampToDateString(viewMemberData.createdOn)}
                </p>
              )}
            </div>
            <MemberBadges badges={viewMemberData.badges} />
            <HRow />
            <MainStatisticsSection
              curID={memberID}
              clickedMemberID={clickedMemberID}
              permission={higher}
            />
          </DefaultCard>
          <MemberTabs memberID={clickedMemberID} view={view} />
          {view === "HA" &&
            (permission ? (
              <Suspense
                key={searchParams.view}
                fallback={<DefaultSkeleton className="h-[20vh]" />}
              >
                <MemberHASection memberID={clickedMemberID} />
              </Suspense>
            ) : (
              <ErrorSection>
                Oops, you do not have permissions to view this section. Please
                ask a commander for assistance.
              </ErrorSection>
            ))}

          {view === "activities" && (
            <Suspense
              key={searchParams.view}
              fallback={<DefaultSkeleton className="h-[50vh]" />}
            >
              <JoinedActivities clickedMemberID={clickedMemberID} />
            </Suspense>
          )}

          {view === "statuses" &&
            (canViewStatus ? (
              <Suspense
                key={searchParams.view}
                fallback={<DefaultSkeleton className="h-[50vh]" />}
              >
                <DefaultCard className="w-full">
                  <StatusFeed viewProfile memberID={clickedMemberID} />
                </DefaultCard>
              </Suspense>
            ) : (
              <ErrorSection>
                Oops, you do not have permissions to view this section. Please
                ask a commander for assistance.
              </ErrorSection>
            ))}

          {view === "settings" &&
            (canViewPerms || permission ? (
              <>
                {canViewPerms && (
                  // global member permissions
                  <PermissionForm
                    currentMember={currentMemberData}
                    viewMember={viewMemberData}
                  />
                )}
                {permission && (
                  <ResetPasswordButton memberID={viewMemberData.memberID} />
                )}
              </>
            ) : (
              <ErrorSection>
                Oops, you do not have permissions to view this section. Please
                ask a commander for assistance.
              </ErrorSection>
            ))}
        </PageCenterWrapper>
      </>
    );
  } catch (err: any) {
    return ErrorScreenHandler(err);
  }
}

{
  /* {(permission || sameMember) && (
                  <>
                    <div className="flex items-center justify-center gap-1 w-full flex-col">
                      <h1 className="text-custom-dark-text font-bold">
                        Duty Points
                      </h1>
                      <div className="flex items-center justify-around gap-3 w-full">
                        <div className="flex flex-col items-center justify-center gap-0">
                          <p className="text-sm text-custom-grey-text">COS</p>
                          <h4 className="text-lg text-custom-dark-text font-bold">
                            {viewMemberData.dutyPoints.cos}
                          </h4>
                        </div>

                        <div className="flex flex-col items-center justify-center gap-0">
                          <p className="text-sm text-custom-grey-text">
                            Guards
                          </p>
                          <h4 className="text-lg text-custom-dark-text font-bold">
                            {viewMemberData.dutyPoints.gd}
                          </h4>
                        </div>
                      </div>
                    </div>
                  </>
                )} */
}
