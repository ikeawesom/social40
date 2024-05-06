import GroupMembers from "../GroupMembers";
import {
  GROUP_MEMBERS_SCHEMA,
  GroupDetailsType,
} from "@/src/utils/schemas/groups";
import { GROUP_ROLES_HEIRARCHY } from "@/src/utils/constants";

export async function GroupNumbersServer({
  groupID,
  currentMember,
  membersList,
}: {
  groupID: string;
  currentMember: GROUP_MEMBERS_SCHEMA;
  membersList: GroupDetailsType;
}) {
  const totalStrength = Object.keys(membersList).length;

  const bookedInStrength = Object.keys(membersList).filter(
    (id: string) => membersList[id].bookedIn
  ).length;

  const commandersStrength = Object.keys(membersList).filter(
    (memberID: string) => {
      return (
        GROUP_ROLES_HEIRARCHY[membersList[memberID].role].rank >=
        GROUP_ROLES_HEIRARCHY["admin"].rank
      );
    }
  ).length;
  return (
    <>
      <h1 className="text-custom-dark-text font-semibold">Strength</h1>

      <h1 className="text-start text-custom-dark-text">
        Booked In:{" "}
        <span className="font-bold">
          {bookedInStrength} / {totalStrength}
        </span>
      </h1>
      <h1 className="text-start text-custom-dark-text">
        Commanders: <span className="font-bold">{commandersStrength}</span>
      </h1>
      <h1 className="text-start text-custom-dark-text">
        Men:{" "}
        <span className="font-bold">{totalStrength - commandersStrength}</span>
      </h1>
      <GroupMembers
        curMember={currentMember}
        groupID={groupID}
        membersList={JSON.parse(JSON.stringify(membersList))}
      />
    </>
  );
}
