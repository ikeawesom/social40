import React, { useEffect, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import LoadingIcon from "../utils/LoadingIcon";
import { twMerge } from "tailwind-merge";
import { toast } from "sonner";
import { MEMBER_BOOKED_IN } from "@/src/utils/schemas/members";
import { dbHandler } from "@/src/firebase/db";
import { useMemberID } from "@/src/hooks/useMemberID";

export default function BiboScanner() {
  const { memberID } = useMemberID();
  const [loading, setLoading] = useState(false);
  const [bookingMember, setBookingMember] = useState("");

  let html5QrCode: Html5Qrcode;

  useEffect(() => {
    function startQR() {
      if (!html5QrCode?.getState()) {
        const config = {
          fps: 10, // Optional, frame per seconds for qr code scanning
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1,
        };
        const successScan = async (text: string) => {
          setLoading(true);
          html5QrCode.pause();
          const data = JSON.parse(text) as MEMBER_BOOKED_IN;
          const bookInOn = data.bookInOn;
          const bookInDate = bookInOn.split(" ")[0];

          const memberBookIn = data.memberID;
          setBookingMember(memberBookIn);

          try {
            const res = await dbHandler.edit({
              col_name: "MEMBERS",
              id: memberBookIn,
              data: { bookedIn: true },
            });

            if (!res.status) throw new Error("Member:", res.error);

            const to_log = {
              membersBookedIn: {
                [bookInDate]: {
                  memberID: memberBookIn,
                  bookInOn: bookInOn,
                } as MEMBER_BOOKED_IN,
              },
            };

            const resA = await dbHandler.edit({
              col_name: "MEMBERS",
              id: memberID,
              data: to_log,
            });

            if (!resA.status) throw new Error("Current:", resA.error);
            toast.success(`Successfully booked in member: ${memberBookIn}`);
          } catch (err: any) {
            toast.error(err.message);
            console.log(err);
          }
          setLoading(false);
          html5QrCode.resume();
        };

        html5QrCode = new Html5Qrcode("reader");
        html5QrCode.start(
          { facingMode: "environment" },
          config,
          successScan,
          () => {}
        );
      }
    }

    if (memberID !== "") startQR();
  }, [memberID]);
  return (
    <div className="flex flex-col items-center justify-center gap-y-3">
      <div
        id="reader"
        className={twMerge(
          "w-[290px] aspect-square rounded-lg overflow-hidden",
          loading ? "hidden" : ""
        )}
      />
      {!loading ? (
        <>
          <p className="animate-pulse font-bold text-custom-green">
            Searching for code...
          </p>
        </>
      ) : (
        <>
          <div className="w-[290px] aspect-square rounded-lg overflow-hidden bg-white grid place-items-center">
            <LoadingIcon />
          </div>
          <p className="animate-pulse font-bold text-custom-orange">
            Booking in {bookingMember}...
          </p>
        </>
      )}
    </div>
  );
}
