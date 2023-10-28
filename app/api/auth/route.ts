import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  const cookieStore = cookies();
  const fetchedData = await request.json();
  const { memberID, strategy } = fetchedData as {
    memberID?: string;
    strategy: "INIT" | "DEL";
  };

  if (strategy === "INIT" && memberID) cookieStore.set("memberID", memberID);
  if (strategy === "DEL") cookieStore.delete("memberID");

  return NextResponse.json({ status: true });
}

export async function GET() {
  const cookieStore = cookies();
  const memberID = cookieStore.get("memberID");
  if (memberID) return NextResponse.json({ status: false, memberID });
  return NextResponse.json({ status: false });
}
