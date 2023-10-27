import { useEffect, useState } from "react";
import { useMemberID } from "./useMemberID";
import QRCode from "qrcode";

export function useBiboQR() {
  const { memberID } = useMemberID();
  const [dataURL, setDataURL] = useState<string>();
  const [error, setError] = useState<string>();

  useEffect(() => {
    const handleQR = (id: string) => {
      QRCode.toDataURL(id, { width: 300 }, (err, dataUrl) => {
        if (err) setError(err.message);
        else setDataURL(dataUrl);
      });
    };

    if (!dataURL && memberID !== "") {
      handleQR(memberID);
    }
  }, [dataURL, memberID]);

  return { dataURL, error };
}
