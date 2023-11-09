import React from "react";
import { BIBO_DB_TYPE } from "@/src/utils/schemas/bibo";
import SecondaryButton from "../utils/SecondaryButton";
import Image from "next/image";
import { ExportExcel } from "@/src/utils/ExportExcel";

type BiboArrType = {
  Date: string;
  Time: string;
  "Member ID": string;
  "BIBO Status": string;
  "Verified By": string;
};

export default function BiboDownloadButton({
  biboData,
}: {
  biboData: BIBO_DB_TYPE;
}) {
  const download = () => {
    let memberID = "";
    let biboArr = [] as BiboArrType[];
    Object.keys(biboData).forEach((date: string) => {
      Object.keys(biboData[date]).forEach((time: string) => {
        const status = biboData[date][time].bookedIn;
        if (memberID === "") {
          memberID = biboData[date][time].memberID;
        }
        const to_push = {
          Date: date,
          Time: time,
          "Member ID": memberID,
          "BIBO Status": status ? "Booked In" : "Booked Out",
          "Verified By": biboData[date][time].verifiedBy,
        };
        biboArr.push(to_push);
      });
    });
    const filename = `${memberID}-bibo-logs`;
    ExportExcel({ excelData: biboArr, filename });
  };
  return (
    <SecondaryButton
      className="flex items-center justify-center gap-1"
      onClick={download}
    >
      Download data{" "}
      <Image src="/icons/icon_download.svg" alt="" width={15} height={15} />
    </SecondaryButton>
  );
}
