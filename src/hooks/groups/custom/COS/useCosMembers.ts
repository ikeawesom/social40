import { dbHandler } from "@/src/firebase/db";
import { GROUP_SCHEMA } from "@/src/utils/schemas/groups";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export function useCOSMembers(groupData: GROUP_SCHEMA) {
  const { cos, groupID } = groupData;
  const router = useRouter();

  const [showAll, setShowAll] = useState(false);
  const [load, setLoad] = useState(false);
  const [clickedID, setClickedID] = useState("");

  const reset = () => {
    setClickedID("");
  };

  const toggleAdmin = async (id: string) => {
    setLoad(true);
    try {
    } catch (err: any) {
      toast.error(err.message);
    }
    setLoad(false);
  };

  const handleRemove = async (id: string) => {
    setLoad(true);
    try {
      if (!cos) return;

      const updatedMembers = cos.members.filter((cur: string) => cur !== id);
      const { error } = await dbHandler.edit({
        col_name: "GROUPS",
        id: groupID,
        data: {
          cos: {
            ...groupData.cos,
            members: updatedMembers,
          },
        },
      });
      if (error) throw new Error(error);

      router.refresh();
      reset();
      toast.success(
        `Removed ${id} from COS duties in ${groupID}. Changes will be updated shortly.`
      );
    } catch (err: any) {
      toast.error(err.message);
    }
    setLoad(false);
  };

  return {
    clickedID,
    setClickedID,
    load,
    toggleAdmin,
    handleRemove,
    showAll,
    setShowAll,
  };
}
