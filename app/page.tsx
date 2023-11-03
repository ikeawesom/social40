import HeaderBar from "@/src/components/navigation/HeaderBar";
import Navbar from "@/src/components/navigation/Navbar";
import SignInAgainScreen from "@/src/components/screens/SignInAgainScreen";
import PrimaryButton from "@/src/components/utils/PrimaryButton";
import SecondaryButton from "@/src/components/utils/SecondaryButton";
import InstallButton from "@/src/utils/InstallButton";
import { Metadata } from "next";
import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

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
        <h1 className="sm:text-6xl text-5xl">
          Social
          <span className="text-custom-primary font-bold text-center">40</span>
        </h1>
        <p className="text-custom-grey-text text-center sm:text-base text-sm">
          Compete and motivate one another to be the best.
        </p>
        <div className="flex items-center justify-between gap-3 w-full my-2">
          <InstallButton />
          {!data ? (
            <Link href="/auth" className="w-full flex-1">
              <PrimaryButton className="flex items-center justify-center">
                Get started
                <Image
                  src="/icons/icon_right_bright.svg"
                  alt=""
                  width={20}
                  height={20}
                />
              </PrimaryButton>
            </Link>
          ) : (
            <Link href="/home" className="w-full flex-1">
              <PrimaryButton className="flex items-center justify-center">
                Go to home
                <Image
                  src="/icons/icon_right_bright.svg"
                  alt=""
                  width={20}
                  height={20}
                />
              </PrimaryButton>
            </Link>
          )}
        </div>
        <p className="text-custom-grey-text text-center text-sm">
          v0.1.0: Please note that this is still a beta testing version. Some
          features may still be unstable.
        </p>
      </div>
    </div>
  );
}
