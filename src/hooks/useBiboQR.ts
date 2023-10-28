import { useEffect, useState } from "react";
import { useMemberID } from "./useMemberID";
import QRCode from "qrcode";
import { MEMBER_BOOKED_IN } from "../utils/schemas/members";
import getCurrentDate from "../utils/getCurrentDate";

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
      const toSend = {
        memberID: memberID,
        bookInOn: getCurrentDate(),
      } as MEMBER_BOOKED_IN;

      const toSendStr = JSON.stringify(toSend);

      handleQR(toSendStr);
    }
  }, [dataURL, memberID]);

  return { dataURL, error };
}
