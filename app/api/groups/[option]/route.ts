import { getMethod } from "@/src/utils/API/getAPIMethod";
import { getJoinedGroups } from "@/src/utils/groups/getJoinedGroups";
import { getOwnedGroups } from "@/src/utils/groups/getOwnedGroups";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const option = getMethod(request.url);
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
  }
  return NextResponse.json({
    status: false,
    error: "Invalid method provided to API request.",
  });
}
