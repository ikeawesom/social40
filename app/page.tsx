import HeaderBar from "@/src/components/navigation/HeaderBar";
import Navbar from "@/src/components/navigation/Navbar";
import SignInAgainScreen from "@/src/components/screens/SignInAgainScreen";
import PrimaryButton from "@/src/components/utils/PrimaryButton";
import SecondaryButton from "@/src/components/utils/SecondaryButton";
import { Metadata } from "next";
import { cookies } from "next/headers";
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
          <Link href="/auth" className="w-full flex-1">
            <SecondaryButton>Install App</SecondaryButton>
          </Link>
          {!data ? (
            <Link href="/home" className="w-full flex-1">
              <PrimaryButton>Get Started</PrimaryButton>
            </Link>
          ) : (
            <Link href="/auth" className="w-full flex-1">
              <PrimaryButton>Go to Home</PrimaryButton>
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
