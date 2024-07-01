import { dbHandler } from "@/src/firebase/db";
import { getMethod } from "@/src/utils/API/getAPIMethod";
import { ROLES_HIERARCHY } from "@/src/utils/constants";
import { DateToTimestamp } from "@/src/utils/helpers/getCurrentDate";
import { BIBO_SCHEMA } from "@/src/utils/schemas/bibo";
import { MEMBER_SCHEMA } from "@/src/utils/schemas/members";
import { NextRequest, NextResponse } from "next/server";

type DataType = {
  memberID: string;
  bookInDate: string;
  bookInTime: string;
  memberBookIn: string;
};

export async function POST(request: NextRequest) {
  const fetchedData = await request.json();
  const { option } = getMethod(request.url);
  const { memberID } = fetchedData;

  if (option === "get") {
    const { viewerRole } = fetchedData;
    try {
      // see if member exists
      const resA = await dbHandler.get({ col_name: `MEMBERS`, id: memberID });
      if (!resA.status)
        throw new Error(
          "No member exists with that member ID. Please try again."
        );

      const { role: curRole }: { role: string } = resA.data;
      if (ROLES_HIERARCHY[viewerRole].rank < ROLES_HIERARCHY[curRole].rank) {
        throw new Error(
          "You do not have permission to view this member's BIBO logs. Contact an administrator or try another member."
        );
      }

      const res = await dbHandler.getSpecific({
        path: `MEMBERS/${memberID}/BIBO`,
        orderCol: "timestamp",
        ascending: true,
      });

      if (!res.status) throw new Error(res.error);

      return NextResponse.json({ status: true, data: res.data });
    } catch (err: any) {
      return NextResponse.json({ status: false, error: err.message });
    }
  } else if (option === "set") {
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
  } else if (option === "set-custom") {
    const { memberBookIn, bookInDate, bookInTime } = fetchedData;

    try {
      // fetch current bibo record
      const resA = await dbHandler.get({
        col_name: `MEMBERS`,
        id: memberBookIn,
      });
      if (!resA.status) throw new Error(resA.error);

      const memberData = resA.data as MEMBER_SCHEMA;
      const { bookedIn } = memberData;

      // log bibo record for member who booked in
      const dateTimeStr = `${bookInDate} ${bookInTime}`;
      const yearInt = Number.parseInt(bookInDate.split("/")[2]);
      const monthInt = Number.parseInt(bookInDate.split("/")[1]);
      const dayInt = Number.parseInt(bookInDate.split("/")[0]);
      const hourInt = Number.parseInt(bookInTime.split(":")[0]);
      const minuteInt = Number.parseInt(bookInTime.split(":")[1]);
      const secondInt = Number.parseInt(bookInTime.split(":")[2]);

      const date = new Date(
        yearInt,
        monthInt - 1,
        dayInt,
        hourInt,
        minuteInt,
        secondInt
      );
      const timestamp = DateToTimestamp(date);
      const dashedDate = bookInDate.split("/").join("-");

      const to_add = {
        verifiedBy: memberID,
        bookedInDate: dashedDate,
        bookedInTime: bookInTime,
        bookedIn: bookedIn,
        memberID: memberBookIn,
        timestamp,
      } as BIBO_SCHEMA;

      const res = await dbHandler.addGeneral({
        path: `MEMBERS/${memberBookIn}/BIBO`,
        to_add,
      });

      if (!res.status) throw new Error(res.error);
      return NextResponse.json({ status: true });
    } catch (err: any) {
      return NextResponse.json({ status: false, error: err.message });
    }
  }
  return NextResponse.json({
    status: false,
    error: "Invalid option given to API.",
  });
}
