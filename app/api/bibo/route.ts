import { dbHandler } from "@/src/firebase/db";
import { MEMBER_SCHEMA } from "@/src/utils/schemas/members";
import { NextRequest, NextResponse } from "next/server";

type DataType = {
  memberID: string;
};

export async function POST(request: NextRequest) {
  const fetchedData = await request.json();

  const { memberID } = fetchedData as DataType;

  try {
    const res = await dbHandler.get({ col_name: "MEMBERS", id: memberID });
    if (!res.status) throw new Error(res.error);

    const memberData = res.data as MEMBER_SCHEMA;
    const bibo = memberData.bookedIn as boolean;

    const newBibo = !bibo;

    const resA = await dbHandler.edit({
      col_name: "MEMBERS",
      id: memberID,
      data: { bookedIn: newBibo },
    });

    if (!resA.status) throw new Error(resA.error);
    return NextResponse.json({ status: true });
  } catch (err: any) {
    return NextResponse.json({ status: false, error: err.message });
  }
}
