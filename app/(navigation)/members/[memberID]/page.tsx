import DefaultCard from "@/src/components/DefaultCard";
import BookedStatus from "@/src/components/members/BookedStatus";
import MemberBadges from "@/src/components/members/MemberBadges";
import MemberPoints from "@/src/components/members/MemberPoints";
import PermissionForm from "@/src/components/members/PermissionForm";
import HeaderBar from "@/src/components/navigation/HeaderBar";
import { StatusListType } from "@/src/components/profile/StatsSection";
import StatusFeed from "@/src/components/profile/stats/StatusFeed";
import SignInAgainScreen from "@/src/components/screens/SignInAgainScreen";
import HRow from "@/src/components/utils/HRow";
import { GetPostObj } from "@/src/utils/API/GetPostObj";
import ErrorScreenHandler from "@/src/utils/ErrorScreenHandler";
import { ROLES_HIERARCHY } from "@/src/utils/constants";
import { MEMBER_SCHEMA } from "@/src/utils/schemas/members";
import { cookies } from "next/headers";
import React from "react";

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
}: {
  params: { memberID: string };
}) {
  const clickedMemberID = params.memberID;
  const cookieStore = cookies();

  const data = cookieStore.get("memberID");
  if (data) {
    const memberID = data.value;
    try {
      const host = process.env.HOST;

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

      const permission =
        ROLES_HIERARCHY[role].rank >= ROLES_HIERARCHY["commander"].rank;

      const higher =
        ROLES_HIERARCHY[role].rank >= ROLES_HIERARCHY[viewMemberData.role].rank;

      const rankName =
        `${viewMemberData.rank} ${viewMemberData.displayName}`.trim();

      // fetch statuses from member
      const resB = await fetch(`${host}/api/profile/status`, PostObjA);
      const dataB = await resB.json();

      if (!dataB.status) throw new Error(dataB.error);

      const statusList = dataB.data as StatusListType;

      return (
        <>
          <HeaderBar text={clickedMemberID} back />
          <div className="grid place-items-center">
            <div className="flex flex-col items-stretch justify-start gap-4 max-w-[500px] w-full">
              <DefaultCard className="flex flex-col items-start justify-center gap-2">
                <div className="flex w-full items-center justify-between">
                  <MemberPoints points={viewMemberData.points} />
                  <BookedStatus status={viewMemberData.bookedIn} />
                </div>
                <div className="flex flex-col items-start justify-center">
                  <h1 className="text-xl text-custom-dark-text">{rankName}</h1>
                  <p className="text-sm text-custom-grey-text">
                    {viewMemberData.memberID}
                  </p>
                  <p className="text-sm text-custom-grey-text">
                    Created on: {viewMemberData.createdOn}
                  </p>
                </div>
                <MemberBadges badges={viewMemberData.badges} />
              </DefaultCard>
              {permission && (
                <DefaultCard className="w-full">
                  <StatusFeed viewProfile status={statusList} />
                </DefaultCard>
              )}
              {higher && (
                <PermissionForm
                  currentMember={currentMemberData}
                  viewMember={viewMemberData}
                />
              )}
            </div>
          </div>
        </>
      );
    } catch (err: any) {
      return ErrorScreenHandler(err);
    }
  }
  return <SignInAgainScreen />;
}
