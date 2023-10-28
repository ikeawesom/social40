import { useBiboQR } from "@/src/hooks/useBiboQR";
import React from "react";
import LoadingIcon from "../utils/LoadingIcon";
import { toast } from "sonner";

export default function BiboQR() {
  const { dataURL, error } = useBiboQR();
  if (error) toast.error(error);

  return (
    <div className="grid place-items-center w-[200px] aspect-square bg-white rounded-lg overflow-hidden">
      {dataURL ? (
        <div className="generated-view">
          <img src={dataURL} alt="qr code" />
        </div>
      ) : (
        <LoadingIcon width={50} height={50} />
      )}
    </div>
  );
}
