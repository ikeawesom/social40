import { dbHandler } from "@/src/firebase/db";
import { GROUP_ROLES_HEIRARCHY } from "@/src/utils/constants";
import { GROUP_MEMBERS_SCHEMA, GROUP_SCHEMA } from "@/src/utils/schemas/groups";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "sonner";

type GroupMemberType = {
  [memberID: string]: GROUP_MEMBERS_SCHEMA;
};

export function useAddCosMembers(
  groupData: GROUP_SCHEMA,
  curMembers: string[]
) {
  const { groupID, cos } = groupData;
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [members, setMembers] = useState<GroupMemberType>({});
  const [toAdd, setToAdd] = useState<string[]>([]);
  const [loadAdd, setLoadAdd] = useState(false);

  const fetchMembers = async () => {
    setLoading(true);

    try {
      const { data, error } = await dbHandler.getSpecific({
        path: `GROUPS/${groupID}/MEMBERS`,
        orderCol: "dateJoined",
        ascending: true,
      });
      if (error) throw new Error(error);

      const membersData = data as GroupMemberType;
      const nonMembers = Object.keys(membersData).filter(
        (id: string) =>
          !curMembers.includes(id) &&
          GROUP_ROLES_HEIRARCHY[membersData[id].role].rank >=
            GROUP_ROLES_HEIRARCHY["admin"].rank
      );

      let tempObj = {} as GroupMemberType;
      nonMembers.forEach((id: string) => {
        tempObj[id] = membersData[id];
      });

      setMembers(tempObj);
    } catch (error: any) {
      toast.error(error.message);
    }
    setLoading(false);
  };
  useEffect(() => {
    if (showModal) fetchMembers();
  }, [showModal]);

  const reset = () => {
    setShowModal(false);
    setToAdd([]);
  };

  const handleToggle = (id: string) => {
    if (toAdd.includes(id)) {
      setToAdd(toAdd.filter((cur) => cur !== id));
    } else {
      setToAdd([...toAdd, id]);
    }
  };

  const handleAdd = async () => {
    setLoadAdd(true);
    try {
      if (!cos) return;

      const { error } = await dbHandler.edit({
        col_name: `GROUPS`,
        id: groupID,
        data: {
          cos: {
            ...cos,
            members: cos.members.concat(toAdd),
          },
        },
      });
      if (error) throw new Error(error);

      router.refresh();
      toast.success(
        `Added selected members for COS duties in ${groupID}. Changes will be updated shortly.`
      );
      reset();
    } catch (err: any) {
      toast.error(err.message);
    }
    setLoadAdd(false);
  };

  return {
    showModal,
    reset,
    loading,
    loadAdd,
    members,
    handleToggle,
    toAdd,
    handleAdd,
    setShowModal,
  };
}
