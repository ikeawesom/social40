"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import SecondaryButton from "../components/utils/SecondaryButton";
import Image from "next/image";

let deferredPrompt: any;

export default function InstallButton() {
  const [install, setInstall] = useState(false);

  useEffect(() => {
    window.addEventListener("beforeinstallprompt", (e: Event) => {
      e.preventDefault();
      deferredPrompt = e;
      setInstall(true);
    });
  }, [deferredPrompt]);

  const handleInstall = () => {
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then(() => {});
  };

  if (install)
    return (
      <Link href="" className="w-full flex-1" onClick={handleInstall}>
        <SecondaryButton className="flex items-center justify-center gap-1 text-lg">
          Get the app
          <Image src="/icons/icon_download.svg" alt="" width={20} height={20} />
        </SecondaryButton>
      </Link>
    );
}
