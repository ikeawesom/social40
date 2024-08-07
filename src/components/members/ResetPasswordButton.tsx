"use client";
import React, { useState } from "react";
import SecondaryButton from "../utils/SecondaryButton";
import { useHostname } from "@/src/hooks/useHostname";
import { LoadingIconBright } from "../utils/LoadingIcon";
import { GetPostObj } from "@/src/utils/API/GetPostObj";
import { toast } from "sonner";
import DefaultCard from "../DefaultCard";
import handleResponses from "@/src/utils/helpers/handleResponses";

export default function ResetPasswordButton({
  memberID,
}: {
  memberID: string;
}) {
  const [loading, setLoading] = useState(false);
  const { host } = useHostname();

  const handleReset = async () => {
    if (
      confirm(
        `Are you sure you want to reset ${memberID}'s password to "password"?`
      )
    ) {
      setLoading(true);
      try {
        const body = await resetLogic();
        if (!body.status) throw new Error(body.error);
        toast.success(`Password reset for ${memberID} to "password".`);
      } catch (err: any) {
        toast.error(err.message);
      }
      setLoading(false);
    }
  };
  const resetLogic = async () => {
    try {
      const memberObj = GetPostObj({ memberID, newPassword: "password" });
      const res = await fetch(`${host}/api/profile/reset-password`, memberObj);
      const body = await res.json();

      if (!body.status) throw new Error(body.error);
      return handleResponses();
    } catch (err: any) {
      return handleResponses({ status: false, error: err.message });
    }
  };
  return (
    <DefaultCard className="w-full">
      <p className="text-center text-custom-grey-text text-xs mb-2">
        All password resets will reset to:{" "}
        <span className="font-semibold">password</span>
      </p>
      <SecondaryButton
        onClick={handleReset}
        className="grid place-items-center text-centerborder-custom-red text-custom-red font-semibold hover:bg-custom-red hover:text-custom-light-text duration-150"
        disabled={loading}
      >
        {loading ? (
          <LoadingIconBright width={20} height={20} />
        ) : (
          "Reset Member Password"
        )}
      </SecondaryButton>
    </DefaultCard>
  );
}
