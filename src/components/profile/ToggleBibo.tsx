import React, { useEffect, useState } from "react";
import SecondaryButton from "../utils/SecondaryButton";

export default function ToggleBibo({
  fetchedBibo,
  handleBibo,
}: {
  fetchedBibo: boolean;
  handleBibo: () => void;
}) {
  const [bibo, setBibo] = useState<boolean>();

  useEffect(() => {
    setBibo(fetchedBibo);
  }, [bibo]);

  if (bibo)
    return (
      <SecondaryButton
        onClick={handleBibo}
        className="font-bold bg-custom-light-green border-custom-green text-custom-green"
      >
        Book Out
      </SecondaryButton>
    );
  return (
    <SecondaryButton
      onClick={handleBibo}
      className="font-bold border-custom-orange text-custom-orange bg-custom-light-orange"
    >
      Book In
    </SecondaryButton>
  );
}
