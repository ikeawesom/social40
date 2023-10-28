import React, { useEffect, useState } from "react";
import SecondaryButton from "../utils/SecondaryButton";
import { twMerge } from "tailwind-merge";
import LoadingIcon from "../utils/LoadingIcon";

export default function ToggleBibo({
  fetchedBibo,
  handleBibo,
  loading,
}: {
  fetchedBibo: boolean;
  handleBibo: () => void;
  loading: boolean;
}) {
  const [bibo, setBibo] = useState<boolean>();

  useEffect(() => {
    setBibo(fetchedBibo);
  }, [bibo]);

  return (
    <SecondaryButton
      disabled={loading}
      onClick={handleBibo}
      className={twMerge(
        "font-bold flex-1",
        bibo
          ? "bg-custom-light-green border-custom-green text-custom-green"
          : "border-custom-orange text-custom-orange bg-custom-light-orange",
        loading ? "opacity-40 grid place-items-center" : ""
      )}
    >
      {loading ? (
        <LoadingIcon width={20} height={20} />
      ) : bibo ? (
        "Book Out"
      ) : (
        "Book In"
      )}
    </SecondaryButton>
  );
}
