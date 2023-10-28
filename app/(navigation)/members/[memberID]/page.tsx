import MemberProfileContainer from "@/src/components/members/MemberProfileContainer";
import HeaderBar from "@/src/components/navigation/HeaderBar";
import LoadingScreenSmall from "@/src/components/screens/LoadingScreenSmall";
import NotFoundScreen from "@/src/components/screens/NotFoundScreen";
import { dbHandler } from "@/src/firebase/db";
import { MEMBER_SCHEMA } from "@/src/utils/schemas/members";
import React from "react";

export default async function MemberPage({
  params,
}: {
  params: { memberID: string };
}) {
  const memberID = params.memberID;

  const res = await dbHandler.get({ col_name: "MEMBERS", id: memberID });
  if (!res.status) {
    // member does not exist
    return <NotFoundScreen />;
  } else if (res.status) {
    const dataFetched = JSON.stringify(res.data);
    const memberData = JSON.parse(dataFetched) as MEMBER_SCHEMA;
    return (
      <>
        <HeaderBar text={memberID} back />
        <MemberProfileContainer viewMemberData={memberData} />
      </>
    );
  }
  return <LoadingScreenSmall />;
}
