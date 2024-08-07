"use client";
import React, { useEffect, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import LoadingIcon, { LoadingIconBright } from "../utils/LoadingIcon";
import { twMerge } from "tailwind-merge";
import Modal from "../utils/Modal";
import SecondaryButton from "../utils/SecondaryButton";
import { toast } from "sonner";
import { GetPostObj } from "@/src/utils/API/GetPostObj";
import { useHostname } from "@/src/hooks/useHostname";
import { BIBO_SCHEMA } from "@/src/utils/schemas/bibo";
import ModalHeader from "../utils/ModalHeader";

export default function BiboScanner({ memberID }: { memberID: string }) {
  const [loading, setLoading] = useState(false);
  const [biboData, setBiboData] = useState<BIBO_SCHEMA>();
  const [biboLoad, setBiboLoad] = useState(false);
  const { host } = useHostname();

  let html5QrCode: Html5Qrcode;

  const handleBookIn = async () => {
    setBiboLoad(true);
    if (!biboData) return;

    try {
      const data = biboData;
      const memberBookIn = data.memberID;

      const PostObj = GetPostObj({ memberID: memberBookIn });
      const res = await fetch(`${host}/api/bibo/set`, PostObj);

      if (!res.status)
        throw new Error(
          "An unknown error occurred. Please restart the app and try again."
        );

      const globalBiboObj = GetPostObj({
        memberID: memberID,
        memberBookIn,
        bookInDate: data.bookedInDate,
        bookInTime: data.bookedInTime,
      });

      const resA = await fetch(`${host}/api/bibo/set-custom`, globalBiboObj);
      const bodyA = await resA.json();

      if (!bodyA.status) throw new Error(bodyA.error);
      toast.success(`Successfully booked in member: ${memberBookIn}`);
    } catch (err: any) {
      toast.error(err.message);
    }
    handleReset();
  };

  const handleReset = () => {
    setBiboLoad(false);
    setBiboData(undefined);
    setLoading(false);
  };

  const successScan = async (text: string) => {
    setLoading(true);
    const data = JSON.parse(text) as BIBO_SCHEMA;
    try {
      setBiboData(data);
    } catch (err: any) {
      toast.error("Invalid BIBO QR Code. Please try again.");
    }
  };

  const config = {
    fps: 10, // Optional, frame per seconds for qr code scanning
    qrbox: { width: 250, height: 250 },
    aspectRatio: 1,
  };

  useEffect(() => {
    function startQR() {
      if (!html5QrCode?.getState()) {
        html5QrCode = new Html5Qrcode("reader");
        html5QrCode.start(
          { facingMode: "environment" },
          config,
          successScan,
          () => {}
        );
      }
    }
    if (memberID !== "" && !loading && !biboData) startQR();
    return () => {
      if (html5QrCode && html5QrCode.isScanning) {
        html5QrCode.stop();
      }
    };
  }, [memberID, biboData, loading]);

  return (
    <>
      {biboData && (
        <Modal className="flex flex-col items-center justify-start gap-10 w-full">
          <ModalHeader
            close={handleReset}
            heading="Book In Member"
            className="mb-2"
          />
          <div className="flex flex-col items-center justify-center">
            <h1 className="text-center">Booking in member:</h1>
            <h1 className="text-center text-custom-primary font-semibold">
              {biboData.memberID}
            </h1>
          </div>
          <div className="w-full items-stretch justify-between gap-2 flex">
            <SecondaryButton
              className="text-sm bg-custom-red text-custom-light-text border-custom-red"
              onClick={handleReset}
            >
              Reject
            </SecondaryButton>
            <SecondaryButton
              disabled={biboLoad}
              onClick={handleBookIn}
              className="text-sm grid place-items-center bg-custom-green text-custom-light-text border-custom-green"
            >
              {biboLoad ? (
                <LoadingIconBright width={20} height={20} />
              ) : (
                "Accept"
              )}
            </SecondaryButton>
          </div>
        </Modal>
      )}
      <div className="flex flex-col items-center justify-center gap-y-3">
        {!loading && (
          <div
            id="reader"
            className={twMerge(
              "min-[300px]:w-[290px] w-[250px] aspect-square rounded-lg overflow-hidden",
              loading ? "hidden" : ""
            )}
          />
        )}
        {!loading ? (
          <div className="flex flex-col gap-2 items-center justify-center">
            <p className="animate-pulse font-bold text-custom-grey-text text-sm text-center">
              Searching for code...
            </p>
          </div>
        ) : (
          <>
            <div className="min-[300px]:w-[290px] w-[250px] aspect-square rounded-lg overflow-hidden bg-white grid place-items-center">
              <LoadingIcon />
            </div>
            <p className="animate-pulse font-bold text-custom-orange text-center text-sm">
              Waiting confirmation...
            </p>
          </>
        )}
      </div>
    </>
  );
}
