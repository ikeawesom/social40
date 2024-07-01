import React from "react";
import { BIBO_DB_TYPE } from "@/src/utils/schemas/bibo";
import SecondaryButton from "../utils/SecondaryButton";
import Image from "next/image";
import { ExportExcel } from "@/src/utils/helpers/ExportExcel";
import { StringToDate } from "@/src/utils/helpers/getCurrentDate";

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

    const sortedBiboData = {} as BIBO_DB_TYPE;
    const sortedBiboArr = Object.keys(biboData).sort((a, b) => {
      const dateStrA = `${biboData[a].bookedInDate.replace(/-/gi, "/")} ${
        biboData[a].bookedInTime
      }`;
      const dateStrB = `${biboData[b].bookedInDate.replace(/-/gi, "/")} ${
        biboData[b].bookedInTime
      }`;

      return (
        new Date(StringToDate(dateStrA).data).getTime() -
        new Date(StringToDate(dateStrB).data).getTime()
      );
    }) as string[];

    sortedBiboArr.forEach((id: string) => {
      sortedBiboData[id] = biboData[id];
    });

    Object.keys(sortedBiboData).forEach((id: string) => {
      const data = sortedBiboData[id];
      const status = data.bookedIn;
      if (memberID === "") {
        memberID = data.memberID;
      }

      const to_push = {
        Date: data.bookedInDate,
        Time: data.bookedInTime,
        "Member ID": memberID,
        "BIBO Status": status ? "Booked In" : "Booked Out",
        "Verified By": data.verifiedBy,
      };
      biboArr.push(to_push);
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
