"use client";
import React, { useState } from "react";
import PrimaryButton from "../../../utils/PrimaryButton";
import { LoadingIconBright } from "../../../utils/LoadingIcon";
import SecondaryButton from "../../../utils/SecondaryButton";
import { toast } from "sonner";
import { useHostname } from "@/src/hooks/useHostname";
import { handleSignOut } from "@/src/contexts/AuthContext";
import { authHandler } from "@/src/firebase/auth";
import Image from "next/image";
import { dbHandler } from "@/src/firebase/db";
import { useMemberID } from "@/src/hooks/useMemberID";

export default function ChangePasswordForm() {
  const { host } = useHostname();
  const [loading, setLoading] = useState(false);
  const { memberID } = useMemberID();
  const [passDetails, setPassDetails] = useState({
    pass: "",
    passCfm: "",
  });
  const [show, setShow] = useState(false);
  const [showCfm, setShowCfm] = useState(false);

  const ready =
    passDetails.pass !== "" && passDetails.pass === passDetails.passCfm;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (memberID === "") throw new Error("Please refresh and try again.");

      const res = await authHandler.changePassword(passDetails.passCfm);
      if (!res.status) throw new Error(res.error);

      const resA = await dbHandler.edit({
        col_name: `MEMBERS`,
        data: { password: passDetails.passCfm },
        id: memberID,
      });

      if (!resA.status) throw new Error(resA.error);

      toast.success("Password changed successfully. Please log in again.");
      await handleSignOut(host);
    } catch (err: any) {
      toast.error(err.message);
    }
    setLoading(false);
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassDetails({ ...passDetails, [e.target.name]: e.target.value });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full flex flex-col items-center justify-start gap-3 mt-4"
    >
      <div className="flex items-center justify-between gap-2 w-full">
        <input
          type={show ? "text" : "password"}
          required
          name="pass"
          value={passDetails.pass}
          onChange={handleChange}
          placeholder="Choose a password"
        />
        <SecondaryButton
          onClick={() => setShow(!show)}
          className="w-fit self-stretch px-2 border-0 shadow-none"
        >
          {show ? (
            <Image
              src="/icons/icon_hide.svg"
              alt="Hide"
              width={30}
              height={30}
            />
          ) : (
            <Image
              src="/icons/icon_show.svg"
              alt="Show"
              width={30}
              height={30}
            />
          )}
        </SecondaryButton>
      </div>
      <div className="flex items-center justify-between gap-2 w-full">
        <input
          type={showCfm ? "text" : "password"}
          required
          name="passCfm"
          value={passDetails.passCfm}
          onChange={handleChange}
          placeholder="Confirm your password"
        />
        <SecondaryButton
          onClick={() => setShowCfm(!showCfm)}
          className="w-fit self-stretch px-2 border-0 shadow-none"
        >
          {showCfm ? (
            <Image
              src="/icons/icon_hide.svg"
              alt="Hide"
              width={30}
              height={30}
            />
          ) : (
            <Image
              src="/icons/icon_show.svg"
              alt="Show"
              width={30}
              height={30}
            />
          )}
        </SecondaryButton>
      </div>
      <PrimaryButton
        type="submit"
        disabled={loading || !ready}
        className="grid place-items-center"
      >
        {loading ? <LoadingIconBright width={20} height={20} /> : "Confirm"}
      </PrimaryButton>
    </form>
  );
}
