import { cookies } from "next/headers";
import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { NextRequest, NextResponse } from "next/server";
import { getMethod } from "@/src/utils/API/getAPIMethod";
import { dbHandler } from "@/src/firebase/db";

export async function POST(request: NextRequest) {
  const cookieStore = cookies();
  const { option } = getMethod(request.url);
  const fetchedData = await request.json();
  // methods are: signin, signup, clear
  if (option === "cookiemember") {
    // get sign in data

    // assign cookies
    const { memberID } = fetchedData;
    cookieStore.set("memberID", memberID);
    console.log("Stored member cookie");
  } else if (option === "signup") {
    // handle sign up requests here
  } else if (option === "clear") {
    // clear all cookies from session
    const cookieNames = cookieStore.getAll();
    cookieNames.forEach((cookie: RequestCookie) => {
      cookieStore.delete(cookie.name);
    });
    console.log("Cleared all cookies.");
  } else if (option === "handle-uid") {
    const { uid, memberID } = fetchedData;
    const res = await dbHandler.add({
      col_name: "MEMBERS-UID",
      id: uid,
      to_add: { uid, memberID },
    });
    if (!res.status)
      return NextResponse.json({ status: false, error: res.error });
    cookieStore.set("uid", uid);
  } else if (option === "handle-uid-member") {
    const { uid } = fetchedData;
    const res = await dbHandler.get({ col_name: "MEMBERS-UID", id: uid });
    if (!res.status)
      return NextResponse.json({ status: false, error: res.error });
    cookieStore.set("uid", res.data.uid);
    cookieStore.set("memberID", res.data.memberID);
  }

  return NextResponse.json({ status: true });
}

export async function GET(request: NextRequest) {
  const cookieStore = cookies();
  const { option } = getMethod(request.url);

  if (option === "signin") {
    // return memberID from cookie store
    const memberID = cookieStore.get("memberID");
    if (!memberID)
      return NextResponse.json({
        status: false,
        error: "MemberID cookie not found in session.",
      });

    return NextResponse.json({ status: true, data: memberID.value });
  }
  return NextResponse.json({ status: false });
}
