import DefaultCard from "@/src/components/DefaultCard";
import HeaderBar from "@/src/components/navigation/HeaderBar";
import ChangePasswordSection from "@/src/components/profile/edit/change-pass/ChangePasswordSection";
import EditProfileForm from "@/src/components/profile/edit/EditProfileForm";
import SignInAgainScreen from "@/src/components/screens/SignInAgainScreen";
import HRow from "@/src/components/utils/HRow";
import SignoutButton from "@/src/components/utils/SignoutButton";
import { GetPostObj } from "@/src/utils/API/GetPostObj";
import ErrorScreenHandler from "@/src/utils/ErrorScreenHandler";
import { ROLES_HIERARCHY, VERSION_NUMBER } from "@/src/utils/constants";
import { MEMBER_SCHEMA } from "@/src/utils/schemas/members";
import { cookies } from "next/headers";
import Image from "next/image";
import NewMemberSection from "@/src/components/profile/edit/new-member/NewMemberSection";
import Link from "next/link";
import ProfilePicSection from "@/src/components/profile/edit/ProfilePicSection";

export default async function EditProfilePage() {
  const cookieStore = cookies();
  const data = cookieStore.get("memberID");

  if (!data) return <SignInAgainScreen />;

  const memberID = data.value;
  try {
    const host = process.env.HOST;

    const PostObj = GetPostObj({
      memberID: memberID,
    });

    // fetch member data from server
    const res = await fetch(`${host}/api/profile/member`, PostObj);
    const data = await res.json();

    if (!data.status) throw new Error(data.error);

    const memberData = data.data as MEMBER_SCHEMA;

    const admin =
      ROLES_HIERARCHY[memberData.role].rank >= ROLES_HIERARCHY["admin"].rank;

    return (
      <>
        <HeaderBar text="Settings" back />
        <div className="grid place-items-center">
          <div className="w-full flex flex-col items-center justify-start gap-4 max-w-[500px]">
            {/* Edit Profile */}
            <DefaultCard className="w-full">
              <h1 className="text-custom-dark-text font-semibold text-start">
                Edit Profile
              </h1>
              <HRow />
              <div className="flex flex-col items-center justify-start gap-4 mt-4">
                <div className="flex flex-col gap-2 items-center justify-center">
                  <ProfilePicSection memberData={memberData} />
                  <p className="text-center text-custom-grey-text text-sm">
                    {memberData.memberID}
                  </p>
                </div>
                <EditProfileForm memberData={memberData} />
              </div>
            </DefaultCard>
            {/* View Hidden Activities */}
            <Link href="/hidden-activities" className="w-full">
              <DefaultCard className="w-full">
                <div className="flex items-center justify-between w-full">
                  <h1 className="text-custom-dark-text font-semibold text-start">
                    View Hidden Activities
                  </h1>
                  <Image
                    src="/icons/icon_arrow-down.svg"
                    width={30}
                    height={30}
                    alt="Show"
                    className="-rotate-90"
                  />
                </div>
              </DefaultCard>
            </Link>

            {/* Change password */}
            <ChangePasswordSection />
            {/* Create Member */}
            {admin && <NewMemberSection memberData={memberData} />}
            <SignoutButton />
          </div>
          <p className="text-custom-grey-text text-center text-sm my-6">
            v{VERSION_NUMBER}
          </p>
        </div>
      </>
    );
  } catch (err: any) {
    return ErrorScreenHandler(err);
  }
}
