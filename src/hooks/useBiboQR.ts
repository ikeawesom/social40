import { useEffect, useState } from "react";
import { useMemberID } from "./useMemberID";
import QRCode from "qrcode";
import getCurrentDate, { TimestampToDateString } from "../utils/getCurrentDate";
import { BIBO_SCHEMA } from "../utils/schemas/bibo";

export function useBiboQR() {
  const { memberID } = useMemberID();
  const [dataURL, setDataURL] = useState<string>();
  const [error, setError] = useState<string>();

  useEffect(() => {
    const handleQR = (data: string) => {
      QRCode.toDataURL(data, { width: 300 }, (err, dataUrl) => {
        if (err) setError(err.message);
        else setDataURL(dataUrl);
      });
    };

    if (!dataURL && memberID !== "") {
      const dateTimestamp = getCurrentDate();
      const dateStr = TimestampToDateString(dateTimestamp);
      const date = dateStr.split(" ")[0];
      const time = dateStr.split(" ")[1];
      const toSend = {
        bookedIn: true,
        verifiedBy: "",
        bookedInDate: date,
        bookedInTime: time,
        memberID: memberID,
      } as BIBO_SCHEMA;

      const toSendStr = JSON.stringify(toSend);

      handleQR(toSendStr);
    }
  }, [dataURL, memberID]);

  return { dataURL, error };
}
