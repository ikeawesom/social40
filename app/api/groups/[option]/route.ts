import { dbHandler } from "@/src/firebase/db";
import { getMethod } from "@/src/utils/API/getAPIMethod";
import { getJoinedGroups } from "@/src/utils/groups/getJoinedGroups";
import { getOwnedGroups } from "@/src/utils/groups/getOwnedGroups";
import { GROUP_MEMBERS_SCHEMA, GROUP_SCHEMA } from "@/src/utils/schemas/groups";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { option } = getMethod(request.url);
  const fetchedData = await request.json();

  const { memberID } = fetchedData;

  if (option === "owned") {
    // fetch owned groups
    const res = await getOwnedGroups({ memberID });
    return NextResponse.json({ status: true, data: res });
  } else if (option === "joined") {
    // fetched joined groups
    const res = await getJoinedGroups({ memberID });
    return NextResponse.json({ status: true, data: res });
  } else if (option === "memberof") {
    // check if member in group
    const { groupID } = fetchedData;
    const res = await dbHandler.get({
      col_name: `GROUPS/${groupID}/MEMBERS`,
      id: memberID,
    });

    if (!res.status)
      return NextResponse.json({ status: false, error: res.error });

    const memberData = res.data as GROUP_MEMBERS_SCHEMA;
    return NextResponse.json({ status: true, data: memberData });
  } else if (option === "custom") {
    // custom group data
    const { groupID } = fetchedData;
    const res = await dbHandler.get({ col_name: "GROUPS", id: groupID });
    if (!res.status)
      return NextResponse.json({
        status: false,
        error: res.error,
      });

    const groupData = res.data as GROUP_SCHEMA;
    return NextResponse.json({ status: true, data: groupData });
  }
  return NextResponse.json({
    status: false,
    error: "Invalid method provided to API request.",
  });
}
