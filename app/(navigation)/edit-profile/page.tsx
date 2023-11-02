import DefaultCard from "@/src/components/DefaultCard";
import HeaderBar from "@/src/components/navigation/HeaderBar";
import ChangePasswordForm from "@/src/components/profile/edit/ChangePasswordForm";
import EditProfileForm from "@/src/components/profile/edit/EditProfileForm";
import SignInAgainScreen from "@/src/components/screens/SignInAgainScreen";
import HRow from "@/src/components/utils/HRow";
import { GetPostObj } from "@/src/utils/API/GetPostObj";
import ErrorScreenHandler from "@/src/utils/ErrorScreenHandler";
import { MEMBER_SCHEMA } from "@/src/utils/schemas/members";
import { cookies } from "next/headers";
import Image from "next/image";

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

    return (
      <>
        <HeaderBar text="Edit Profile" back />
        <div className="w-full flex flex-col items-center justify-start gap-4">
          <DefaultCard className="w-full flex flex-col items-center justify-start gap-4">
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
          </DefaultCard>
          <DefaultCard className="w-full">
            <h1 className="text-custom-dark-text font-semibold text-start">
              Change Password
            </h1>
            <HRow />
            <ChangePasswordForm />
          </DefaultCard>
        </div>
      </>
    );
  } catch (err: any) {
    return ErrorScreenHandler(err);
  }
}
