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
        <ComingSoonCard text="Group Activities" />
      </>
    );
  }
  return <SignInAgainScreen />;
}
