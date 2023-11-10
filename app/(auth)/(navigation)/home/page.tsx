import HeaderBar from "@/src/components/navigation/HeaderBar";
import SignInAgainScreen from "@/src/components/screens/SignInAgainScreen";
import ComingSoonCard from "@/src/components/utils/ComingSoonCard";
import { Metadata } from "next";
import { cookies } from "next/headers";

export const metadata: Metadata = {
  title: "Home",
};

export default async function Home() {
  const cookieStore = cookies();
  const data = cookieStore.get("memberID");
  if (data) {
    const memberID = data.value;

    return (
      <>
        <HeaderBar text="Home" />
        <div className="w-full grid place-items-center">
          <div className="flex flex-col w-full items-center justify-start gap-4 max-w-[500px]">
            <ComingSoonCard text="Group Activities" />
            <ComingSoonCard text="Friends Activities" />
          </div>
        </div>
      </>
    );
  }
  return <SignInAgainScreen />;
}
