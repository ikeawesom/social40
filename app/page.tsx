import Hero from "@/src/components/Hero";
import PrimaryButton from "@/src/components/utils/PrimaryButton";
import InstallButton from "@/src/utils/InstallButton";
import { VERSION_DESC, VERSION_NUMBER } from "@/src/utils/constants";
import { Metadata } from "next";
import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Social 40",
  description: "Created by Ike Lim",
};

export default async function Home() {
  const cookieStore = cookies();
  const data = cookieStore.get("memberID");

  return (
    <div className="grid place-items-center h-[80vh]">
      <div className="flex flex-col gap-y-4 items-center justify-center">
        <Hero />
        <div className="flex items-center justify-between gap-3 w-full max-[400px]:flex-col">
          <InstallButton />
          {!data ? (
            <Link href="/auth" className="w-full flex-1">
              <PrimaryButton className="flex items-center justify-center text-lg">
                Get started
                <Image
                  src="/icons/icon_right_bright.svg"
                  alt=""
                  width={30}
                  height={30}
                />
              </PrimaryButton>
            </Link>
          ) : (
            <Link href="/home" className="w-full flex-1">
              <PrimaryButton className="flex items-center justify-center text-lg">
                Go to home
                <Image
                  src="/icons/icon_right_bright.svg"
                  alt=""
                  width={30}
                  height={30}
                />
              </PrimaryButton>
            </Link>
          )}
        </div>
        <div className="flex flex-col gap-2 items-center justify-center">
          <p className="text-custom-grey-text text-center text-sm">
            v{VERSION_NUMBER}: {VERSION_DESC}
          </p>
          <Link
            href="/docs/updates"
            className="text-custom-primary font-semibold text-sm hover:underline duration-200"
          >
            View updates
          </Link>
        </div>
      </div>
    </div>
  );
}
