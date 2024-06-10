"use client";
import React, { useEffect, useState } from "react";
import SecondaryButton from "../utils/SecondaryButton";
import { twMerge } from "tailwind-merge";
import { ROLES_HIERARCHY } from "@/src/utils/constants";
import { useHostname } from "@/src/hooks/useHostname";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { GetPostObj } from "@/src/utils/API/GetPostObj";
import { getCurrentDateString } from "@/src/utils/helpers/getCurrentDate";
import { useBiboCtx } from "@/src/contexts/BiboContext";

export default function ToggleBibo({
  fetchedBibo,
  role,
  memberID,
}: {
  fetchedBibo: boolean;
  role: string;
  memberID: string;
}) {
  const router = useRouter();
  const { host } = useHostname();
  const { clientBibo, setClientBibo } = useBiboCtx();

  useEffect(() => {
    if (clientBibo === null) setClientBibo(fetchedBibo);
  }, []);

  const aboveCOS =
    ROLES_HIERARCHY[role].rank >= ROLES_HIERARCHY["memberPlus"].rank;
  const [loading, setLoading] = useState(false);

  const handleBibo = async () => {
    if (clientBibo || aboveCOS) {
      setLoading(true);
      if (confirm("Press OK to confirm")) {
        try {
          const PostObj = GetPostObj({ memberID });

          const res = await fetch(`${host}/api/bibo/set`, PostObj);
          const body = await res.json();
          if (!body.status) throw new Error(body.error);

          const date = getCurrentDateString();
          const bookInDate = date.split(" ")[0];
          const bookInTime = date.split(" ")[1];

          const PostObjA = GetPostObj({
            memberID,
            memberBookIn: memberID,
            bookInDate,
            bookInTime,
          });

          const resA = await fetch(`${host}/api/bibo/set-custom`, PostObjA);
          const bodyA = await resA.json();

          if (!bodyA.status) throw new Error(bodyA.error);

          router.refresh();
          setClientBibo((cur) => !cur);
        } catch (error: any) {
          toast.error(error.message);
        }
      }
      setLoading(false);
    } else {
      router.push("/bibo", { scroll: false });
    }
  };

  const notReady = loading || clientBibo === null;
  return (
    <SecondaryButton
      disabled={notReady}
      onClick={handleBibo}
      className={twMerge(
        "font-bold flex-1",
        clientBibo
          ? "bg-custom-light-green border-custom-green text-custom-green"
          : "border-custom-orange text-custom-orange bg-custom-light-orange",
        notReady ? "grid place-items-center" : ""
      )}
    >
      {notReady ? "Working..." : clientBibo ? "Book Out" : "Book In"}
    </SecondaryButton>
  );
}
