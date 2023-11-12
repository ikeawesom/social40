import FeedGroup from "@/src/components/feed/FeedGroup";
import HomeHeaderBar from "@/src/components/navigation/HomeHeaderBar";
import SignInAgainScreen from "@/src/components/screens/SignInAgainScreen";
import ComingSoonIcon from "@/src/components/utils/ComingSoonIcon";
import { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Home",
};

export default async function Home({
  searchParams,
}: {
  searchParams: { activity: string };
}) {
  const activityType = searchParams.activity;

  if (!activityType)
    redirect(`/home?${new URLSearchParams({ activity: "groups" })}`);

  const cookieStore = cookies();
  const data = cookieStore.get("memberID");
  if (data) {
    const memberID = data.value;

    return (
      <>
        <HomeHeaderBar text="Social40" params={activityType} />
        <div className="w-full grid place-items-center mt-[5.5rem]">
          <div className="flex flex-col w-full items-center justify-start gap-4 max-w-[500px]">
            {activityType === "groups" ? (
              <FeedGroup memberID={memberID} />
            ) : (
              <ComingSoonIcon className="gap-2 mt-28" />
              // <FeedFriends memberID={memberID}/>
            )}
          </div>
        </div>
      </>
    );
  }
  return <SignInAgainScreen />;
}
