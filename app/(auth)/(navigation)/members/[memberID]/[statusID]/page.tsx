import React from "react";
import DefaultCard from "@/src/components/DefaultCard";
import ActiveStatusSection from "@/src/components/members/status/ActiveStatusSection";
import EndorseSection from "@/src/components/members/status/EndorseSection";
import HeaderBar from "@/src/components/navigation/HeaderBar";
import RestrictedScreen from "@/src/components/screens/RestrictedScreen";
import SignInAgainScreen from "@/src/components/screens/SignInAgainScreen";
import HRow from "@/src/components/utils/HRow";
import { GetPostObj } from "@/src/utils/API/GetPostObj";
import ErrorScreenHandler from "@/src/utils/ErrorScreenHandler";
import { ROLES_HIERARCHY } from "@/src/utils/constants";
import { MEMBER_SCHEMA } from "@/src/utils/schemas/members";
import { STATUS_SCHEMA } from "@/src/utils/schemas/statuses";
import { cookies } from "next/headers";
import { Metadata } from "next";
import {
  ActiveTimestamp,
  TimestampToDateString,
} from "@/src/utils/getCurrentDate";
import RevokeStatus from "@/src/components/status/RevokeStatus";

export const metadata: Metadata = {
  title: "Status",
};

export default async function CustomStatusPage({
  params,
}: {
  params: { memberID: string; statusID: string };
}) {
  const cookieStore = cookies();
  const data = cookieStore.get("memberID");

  if (!data) return <SignInAgainScreen />;

  const adminID = data.value;
  try {
    const host = process.env.HOST;

    const memberPostObj = GetPostObj({ memberID: adminID });
    const res = await fetch(`${host}/api/profile/member`, memberPostObj);
    const body = await res.json();

    if (!body.status) throw new Error(body.error);

    // check role of current member
    const data = body.data as MEMBER_SCHEMA;
    const { role } = data;

    const commanderRole =
      ROLES_HIERARCHY[role].rank >= ROLES_HIERARCHY["commander"].rank;

    // check if status belongs to member
    const { memberID, statusID } = params;
    const StatusPostObj = GetPostObj({
      memberID,
      statusID,
    });

    const resB = await fetch(
      `${host}/api/profile/member-status`,
      StatusPostObj
    );
    const bodyB = await resB.json();

    // reject if status does not belong to member and member is not a commander
    if (!commanderRole && !bodyB.status) return <RestrictedScreen />;

    const sameMember = adminID === memberID;

    const resA = await fetch(
      `${host}/api/profile/custom-status`,
      StatusPostObj
    );
    const bodyA = await resA.json();

    if (!bodyA.status) throw new Error(bodyA.error);
    const statusData = bodyA.data as STATUS_SCHEMA;

    const { endDate } = statusData;
    const active = ActiveTimestamp(endDate);

    return (
      <>
        <HeaderBar back text={`Status`} />
        <div className="w-full grid place-items-center">
          <div className="flex flex-col items-start justify-center gap-4 w-full max-w-[500px]">
            <DefaultCard className="w-full flex flex-col items-start justify-center gap-2">
              <div className="w-full flex flex-col items-start justify-center">
                <h1 className="text-custom-dark-text font-semibold text-start">
                  {memberID}
                </h1>
                <HRow />
              </div>
              <div className="flex flex-col w-full items-start justify-center">
                <p className="text-custom-grey-text text-sm">
                  Prescribed by: {statusData.doctor}
                </p>
                <h1 className="text-custom-dark-text text-xl">
                  {statusData.statusTitle}
                </h1>
                <h3 className="text-custom-dark-text">
                  {statusData.statusDesc}
                </h3>
                <p className="text-custom-grey-text text-sm">
                  Start Date:{" "}
                  {TimestampToDateString(statusData.startDate).split(" ")[0]}
                </p>
                <p className="text-custom-grey-text text-sm">
                  End Date: {TimestampToDateString(endDate).split(" ")[0]}
                </p>
                <p>debug: {TimestampToDateString(endDate)}</p>
              </div>
            </DefaultCard>
            <ActiveStatusSection active={active} />

            {/* Commander's who do not own the status can view */}
            {/* Anyone can only view once their status has been endorsed */}
            {((commanderRole && !sameMember) ||
              (sameMember && statusData.endorsed.status)) && (
              <EndorseSection
                adminID={adminID}
                memberID={memberID}
                statusData={statusData}
              />
            )}

            <RevokeStatus
              commander={commanderRole}
              own={sameMember}
              memberID={memberID}
              statusID={statusID}
            />
          </div>
        </div>
      </>
    );
  } catch (err: any) {
    return ErrorScreenHandler(err);
  }
}
