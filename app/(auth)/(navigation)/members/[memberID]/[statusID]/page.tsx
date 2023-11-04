import React from "react";
import DefaultCard from "@/src/components/DefaultCard";
import ActiveStatusSection from "@/src/components/members/status/ActiveStatusSection";
import EndorseSection from "@/src/components/members/status/EndorseSection";
import HeaderBar from "@/src/components/navigation/HeaderBar";
import RestrictedScreen from "@/src/components/screens/RestrictedScreen";
import HRow from "@/src/components/utils/HRow";
import { GetPostObj } from "@/src/utils/API/GetPostObj";
import ErrorScreenHandler from "@/src/utils/ErrorScreenHandler";
import { ROLES_HIERARCHY } from "@/src/utils/constants";
import { getActiveStatus } from "@/src/utils/getActiveStatus";
import { MEMBER_SCHEMA } from "@/src/utils/schemas/members";
import { STATUS_SCHEMA } from "@/src/utils/schemas/statuses";
import { cookies } from "next/headers";
import { Metadata } from "next";
import { redirect } from "next/navigation";

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

  if (!data) redirect("/auth-error");

  const adminID = data.value;
  try {
    const host = process.env.HOST;

    const memberPostObj = GetPostObj({ memberID: adminID });
    const res = await fetch(`${host}/api/profile/member`, memberPostObj);
    const body = await res.json();

    if (!body.status) throw new Error(body.error);

    const data = body.data as MEMBER_SCHEMA;
    const { role } = data;

    const admin = ROLES_HIERARCHY[role].rank >= ROLES_HIERARCHY["admin"].rank;

    if (!admin) return <RestrictedScreen />;

    const { memberID, statusID } = params;
    const PostObj = GetPostObj({
      memberID,
      statusID,
    });

    const resA = await fetch(`${host}/api/profile/custom-status`, PostObj);
    const bodyA = await resA.json();

    if (!bodyA.status) throw new Error(bodyA.error);
    const statusData = bodyA.data as STATUS_SCHEMA;

    const active = getActiveStatus(statusData.endDate);
    return (
      <>
        <HeaderBar back text={`Status`} />
        <div className="flex flex-col items-start justify-center gap-4">
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
              <h3 className="text-custom-dark-text">{statusData.statusDesc}</h3>
              <p className="text-custom-grey-text text-sm">
                Start Date: {statusData.startDate}
              </p>
              <p className="text-custom-grey-text text-sm">
                End Date: {statusData.endDate}
              </p>
            </div>
          </DefaultCard>
          <ActiveStatusSection active={active} />
          <EndorseSection
            adminID={adminID}
            memberID={memberID}
            statusData={statusData}
          />
        </div>
      </>
    );
  } catch (err: any) {
    return ErrorScreenHandler(err);
  }
}
