import { cookies } from "next/headers";
import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { NextRequest, NextResponse } from "next/server";
import { getMethod } from "@/src/utils/API/getAPIMethod";

export async function POST(request: NextRequest) {
  const cookieStore = cookies();
  const method = getMethod(request.url);

  // methods are: signin, signup, clear
  if (method === "signin") {
    const fetchedData = (await request.json()) as {
      memberID: string;
    };
    const { memberID } = fetchedData;
    cookieStore.set("memberID", memberID);
    console.log("Stored member cookie");
  } else if (method === "signup") {
    // handle sign up requests here
  } else if (method === "clear") {
    // clear all cookies from session
    const cookieNames = cookieStore.getAll();
    cookieNames.forEach((cookie: RequestCookie) => {
      cookieStore.delete(cookie.name);
    });
    console.log("Cleared all cookies.");
  }

  return NextResponse.json({ status: true });
}

export async function GET(request: NextRequest) {
  const cookieStore = cookies();
  const method = getMethod(request.url);

  if (method === "signin") {
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
