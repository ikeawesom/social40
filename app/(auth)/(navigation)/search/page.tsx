import HeaderBar from "@/src/components/navigation/HeaderBar";
import SignInAgainScreen from "@/src/components/screens/SignInAgainScreen";
import SearchClient from "@/src/components/search/SearchClient";
import PageCenterWrapper from "@/src/components/utils/PageCenterWrapper";
import { getMemberAuthServer } from "@/src/utils/auth/handleServerAuth";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Search",
};

export default async function SearchPage() {
  const { user, isAuthenticated } = await getMemberAuthServer();
  if (!isAuthenticated || user === null) return <SignInAgainScreen />;

  return (
    <>
      <HeaderBar text="Search" />
      <PageCenterWrapper>
        <SearchClient />
      </PageCenterWrapper>
    </>
  );
}
