import {
  EditMemberCOSPoints,
  RemoveMemberCOS,
} from "@/src/utils/groups/COS/handleCOS";
import { GROUP_SCHEMA } from "@/src/utils/schemas/groups";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { toast } from "sonner";

export function useCOSMembers(groupData: GROUP_SCHEMA) {
  const { cos, groupID } = groupData;
  const router = useRouter();

  const [showAll, setShowAll] = useState(false);
  const [load, setLoad] = useState(false);
  const [clickedID, setClickedID] = useState("");

  const [modify, setModify] = useState(false);
  const [curPoints, setCurPoints] = useState<string>();
  const onChangePoints = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurPoints(e.target.value);
  };

  const reset = () => {
    setClickedID("");
    setModify(false);
  };

  const handleSubmit = async (e: FormEvent) => {
    setLoad(true);
    e.preventDefault();
    try {
      const { error } = await EditMemberCOSPoints(
        clickedID,
        parseInt(curPoints ?? "0")
      );
      if (error) throw new Error(error);
      router.refresh();
      reset();
      toast.success(`Score for ${clickedID} has been updated.`);
    } catch (err: any) {
      toast.error(err.message);
    }
    setLoad(false);
  };

  const toggleAdmin = async (id: string) => {
    setLoad(true);
    try {
      // todo
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
      const { error } = await RemoveMemberCOS(
        groupID,
        groupData,
        updatedMembers
      );
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
    reset,
    modify,
    setModify,
    setCurPoints,
    handleSubmit,
    curPoints,
    onChangePoints,
  };
}
