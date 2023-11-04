import DefaultCard from "@/src/components/DefaultCard";
import HeaderBar from "@/src/components/navigation/HeaderBar";
import ChangePasswordForm from "@/src/components/profile/edit/ChangePasswordForm";
import CreateNewMemberForm from "@/src/components/profile/edit/CreateNewMemberForm";
import EditProfileForm from "@/src/components/profile/edit/EditProfileForm";
import HRow from "@/src/components/utils/HRow";
import SignoutButton from "@/src/components/utils/SignoutButton";
import { GetPostObj } from "@/src/utils/API/GetPostObj";
import ErrorScreenHandler from "@/src/utils/ErrorScreenHandler";
import { ROLES_HIERARCHY } from "@/src/utils/constants";
import { MEMBER_SCHEMA } from "@/src/utils/schemas/members";
import { cookies } from "next/headers";
import Image from "next/image";
import { redirect } from "next/navigation";

export default async function EditProfilePage() {
  const cookieStore = cookies();
  const data = cookieStore.get("memberID");

  if (!data) redirect("/auth-error");

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
                  <Image
                    src="/icons/icon_avatar.svg"
                    height={80}
                    width={80}
                    alt="Profile"
                    className="drop-shadow-md"
                  />
                  <p className="text-center text-custom-grey-text text-sm">
                    {memberData.memberID}
                  </p>
                </div>
                <EditProfileForm memberData={memberData} />
              </div>
            </DefaultCard>
            {/* Change password */}
            <DefaultCard className="w-full">
              <h1 className="text-custom-dark-text font-semibold text-start">
                Change Password
              </h1>
              <HRow />
              <ChangePasswordForm />
            </DefaultCard>
            {/* Create Member */}
            {admin && (
              <DefaultCard className="w-full">
                <h1 className="text-custom-dark-text font-semibold text-start">
                  Create New Member
                </h1>
                <HRow />
                <CreateNewMemberForm memberData={memberData} />
              </DefaultCard>
            )}
            <SignoutButton />
          </div>
        </div>
      </>
    );
  } catch (err: any) {
    return ErrorScreenHandler(err);
  }
}
