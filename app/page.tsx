import Hero from "@/src/components/Hero";
import PageWrapper from "@/src/components/PageWrapper";
import PrimaryButton from "@/src/components/utils/PrimaryButton";
import InstallButton from "@/src/components/InstallButton";
import { VERSION_NUMBER } from "@/src/utils/versions";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getMemberAuthServer } from "@/src/utils/auth/handleServerAuth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Social 40",
  description: "Created by Ike Lim",
};

export default async function Home() {
  const { isAuthenticated } = await getMemberAuthServer();
  if (isAuthenticated) redirect("/home");

  return (
    <>
      <PageWrapper>
        <div className="grid place-items-center h-[80vh]">
          <div className="flex flex-col gap-y-4 items-center justify-center">
            <Hero />
            <div className="flex items-center justify-between gap-3 w-full max-[400px]:flex-col">
              <InstallButton />
              <Link scroll={false} href="/auth" className="w-full flex-1">
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
            </div>
            <div className="flex flex-col gap-2 items-center justify-center">
              <p className="text-custom-grey-text text-center text-sm">
                App Version: v{VERSION_NUMBER}
              </p>
            </div>
          </div>
        </div>
      </PageWrapper>
    </>
  );
}
