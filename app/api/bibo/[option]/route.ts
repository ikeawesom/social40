import { dbHandler } from "@/src/firebase/db";
import { getMethod } from "@/src/utils/API/getAPIMethod";
import { TimestampToDateString } from "@/src/utils/getCurrentDate";
import { BIBO_DB_TYPE, BIBO_SCHEMA } from "@/src/utils/schemas/bibo";
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
    try {
      // see if member exists
      const resA = await dbHandler.get({ col_name: `MEMBERS`, id: memberID });
      if (!resA.status)
        throw new Error(
          "No member exists with that member ID. Please try again."
        );

      const res = await dbHandler.getDocs({
        col_name: `MEMBERS/${memberID}/BIBO`,
      });

      if (!res.status) throw new Error(res.error);

      const biboArr = res.data as any;
      var obj = {} as BIBO_DB_TYPE;
      var empty = biboArr.length === 0;

      if (empty) return NextResponse.json({ status: true, data: {} });

      biboArr.forEach((doc: any) => {
        const dateData = doc.data() as BIBO_SCHEMA;
        const tempKey = Object.keys(dateData)[0] as string;
        const date = dateData[tempKey].bookedInDate;
        obj[date] = dateData;
      });

      return NextResponse.json({ status: true, data: obj });
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
    const { memberBookIn, bookInDate, bookInTime, timestamp } = fetchedData;

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
      const dashedDate = bookInDate.split("/").join("-");

      const to_add = {
        [bookInTime]: {
          verifiedBy: memberID,
          bookedInDate: dashedDate,
          bookedInTime: bookInTime,
          bookedIn: bookedIn,
          memberID: memberBookIn,
          timestamp,
        },
      } as BIBO_SCHEMA;

      const res = await dbHandler.edit({
        col_name: `MEMBERS/${memberBookIn}/BIBO`,
        id: dashedDate,
        data: to_add,
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
