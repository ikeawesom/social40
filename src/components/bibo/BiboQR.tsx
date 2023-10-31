import { useBiboQR } from "@/src/hooks/useBiboQR";
import React from "react";
import LoadingIcon from "../utils/LoadingIcon";
import { toast } from "sonner";
import Image from "next/image";

export default function BiboQR() {
  const { dataURL, error } = useBiboQR();
  if (error) toast.error(error);

  return (
    <div className="grid place-items-center w-[200px] aspect-square bg-white rounded-lg overflow-hidden">
      {dataURL ? (
        <div className="generated-view">
          <Image src={dataURL} alt="qr code" width={200} height={200} />
        </div>
      ) : (
        <LoadingIcon width={50} height={50} />
      )}
    </div>
  );
}
