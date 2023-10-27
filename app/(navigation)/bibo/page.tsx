"use client";
import React from "react";
import HeaderBar from "@/src/components/navigation/HeaderBar";
import { doc, onSnapshot } from "firebase/firestore";
import { FIREBASE_DB } from "@/src/firebase/db";
import { MEMBER_SCHEMA } from "@/src/utils/schemas/members";
import { useRouter } from "next/navigation";
import LoadingScreenSmall from "@/src/components/screens/LoadingScreenSmall";
import BiboQR from "@/src/components/bibo/BiboQR";
import { useMemberID } from "@/src/hooks/useMemberID";

export default function BiboPage() {
  const { memberID } = useMemberID();
  const router = useRouter();

  if (memberID) {
    const unsub = onSnapshot(doc(FIREBASE_DB, "MEMBERS", memberID), (doc) => {
      const data = doc.data() as MEMBER_SCHEMA;
      const biboStatus = data.bookedIn;

      if (biboStatus === true) router.replace("/profile");
    });
  }
  return (
    <>
      <HeaderBar back text="BIBO Status" />
      {memberID ? (
        <div className="flex flex-col items-center justify-start gap-10">
          <div className="flex flex-col items-center justify-center gap-1">
            <h1 className="min-[300px]:text-2xl text-xl font-bold text-custom-dark-text text-center">
              Requesting to Book In
            </h1>
            <p className="text-center min-[300px]:text-sm text-xs text-custom-grey-text">
              Please let an administrator scan your unique QR Code below to book
              in.
            </p>
          </div>
          <BiboQR />
          <p className="animate-pulse font-bold text-custom-green">
            Waiting for scan...
          </p>
        </div>
      ) : (
        <LoadingScreenSmall />
      )}
    </>
  );
}
