import DefaultCard from "@/src/components/DefaultCard";
import HeaderBar from "@/src/components/navigation/HeaderBar";
import ChangePasswordSection from "@/src/components/profile/edit/change-pass/ChangePasswordSection";
import EditProfileForm from "@/src/components/profile/edit/EditProfileForm";
import HRow from "@/src/components/utils/HRow";
import SignoutButton from "@/src/components/utils/SignoutButton";
import { GetPostObj } from "@/src/utils/API/GetPostObj";
import ErrorScreenHandler from "@/src/components/ErrorScreenHandler";
import { MEMBER_SCHEMA } from "@/src/utils/schemas/members";
import Image from "next/image";
import NewMemberSection from "@/src/components/profile/edit/new-member/NewMemberSection";
import Link from "next/link";
import ProfilePicSection from "@/src/components/profile/edit/ProfilePicSection";
import { VERSION_NUMBER } from "@/src/utils/versions";
import { ROLES_HIERARCHY } from "@/src/utils/constants";
import { getMemberAuthServer } from "@/src/utils/auth/handleServerAuth";

export default async function EditProfilePage() {
  const { user, isAuthenticated } = await getMemberAuthServer();
  if (!isAuthenticated || user === null) return;
  const { memberID } = user;

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
      ROLES_HIERARCHY[memberData.role].rank >=
      ROLES_HIERARCHY["memberPlus"].rank;

    return (
      <>
        <HeaderBar text="Settings" back />
        <div className="grid place-items-center">
          <div className="w-full flex flex-col items-center justify-start gap-3 max-w-[500px]">
            {/* Edit Profile */}
            <DefaultCard className="w-full">
              <h1 className="text-custom-dark-text font-semibold text-start text-sm">
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
            <Link scroll={false} href="/docs/updates" className="w-full">
              <DefaultCard className="hover:brightness-95 duration-150 w-full py-2 px-3">
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center justify-start gap-2">
                    <Image
                      src="/icons/navigation/icon_rocket.svg"
                      width={25}
                      height={25}
                      alt=""
                    />
                    <h1 className="text-custom-dark-text font-semibold text-start text-sm">
                      View Updates
                    </h1>
                  </div>
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
            {/* View Hidden Activities */}
            <Link scroll={false} href="/hidden-activities" className="w-full">
              <DefaultCard className="hover:brightness-95 duration-150 w-full py-2 px-3">
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center justify-start gap-2">
                    <Image
                      src="/icons/navigation/icon_eye_primary.svg"
                      width={25}
                      height={25}
                      alt=""
                    />
                    <h1 className="text-custom-dark-text font-semibold text-start text-sm">
                      View Hidden Activities
                    </h1>
                  </div>
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

            <Link
              scroll={false}
              href="/credits"
              className="rounded-lg w-full relative overflow-hidden gradient-box p-1 hover:brightness-105 duration-150"
            >
              <div className="shimmer slow" />
              <DefaultCard className="w-full py-2 px-3">
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center justify-start gap-2">
                    <Image
                      src="/icons/icon_heart.png"
                      width={25}
                      height={25}
                      alt=""
                    />
                    <h1 className="text-custom-dark-text font-semibold text-start text-sm">
                      Credits
                    </h1>
                  </div>
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
