import { useRouter } from "next/navigation";
import { useState, FormEvent } from "react";
import { toast } from "sonner";
import { removeMembers, manageAdmin } from "./handleMembers";
import { handleModify } from "./handleSelectActions";
import { GROUP_MEMBERS_SELECT_OPTIONS } from "@/src/utils/constants";
import { handleReload } from "@/src/components/navigation/HeaderBar";

const DEFAULT_SELECT = {
  state: false,
  members: [] as string[],
};

const DEFAULT_ACTION = Object.keys(GROUP_MEMBERS_SELECT_OPTIONS)[0];

export function useHandleSelectActions(groupID: string) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [actions, setActions] = useState(DEFAULT_ACTION);
  const [select, setSelect] = useState(DEFAULT_SELECT);

  const reset = () => {
    setSelect(DEFAULT_SELECT);
    setActions(DEFAULT_ACTION);
  };

  const confirmBookIn = async () => {
    if (
      confirm(
        "Are you sure you want to book in selected members of this group?"
      )
    ) {
      setLoading(true);
      try {
        const res = await handleModify(select.members, { bookedIn: true });
        if (!res.status) throw new Error(res.error);
        toast.success("Successfully welcomed back selected members.");
        router.refresh();
      } catch (err: any) {
        toast.error(err.message);
      }
      setLoading(false);
    }
  };

  const confirmBookOut = async () => {
    if (
      confirm(
        "Are you sure you want to book out selected members of this group?"
      )
    ) {
      setLoading(true);
      try {
        const res = await handleModify(select.members, { bookedIn: false });
        if (!res.status) throw new Error(res.error);
        toast.success("Happy book out selected members!");
        router.refresh();
      } catch (err: any) {
        toast.error(err.message);
      }
      setLoading(false);
    }
  };

  const confirmCourse = async () => {
    if (
      confirm("Are you sure you want to mark the selected members on-course?")
    ) {
      setLoading(true);
      try {
        const res = await handleModify(select.members, {
          isOnCourse: true,
          bookedIn: false,
        });
        if (!res.status) throw new Error(res.error);
        toast.success("Great, we marked these members as on-course.");
        router.refresh();
      } catch (err: any) {
        toast.error(err.message);
      }
      setLoading(false);
    }
  };

  const confirmUncourse = async () => {
    if (
      confirm("Are you sure you want to unmark the selected members on-course?")
    ) {
      setLoading(true);
      try {
        const res = await handleModify(select.members, {
          isOnCourse: false,
          bookedIn: true,
        });
        if (!res.status) throw new Error(res.error);
        toast.success("Welcome back, members as on-course!");
        router.refresh();
      } catch (err: any) {
        toast.error(err.message);
      }
      setLoading(false);
    }
  };

  const confirmRemove = async () => {
    if (
      confirm("Are you sure you want to remove these members from this group?")
    ) {
      setLoading(true);
      try {
        const res = await removeMembers(groupID, select.members);
        if (!res.status) throw new Error(res.error);
        toast.success("Goodbye to those members.");
        router.refresh();
      } catch (err: any) {
        toast.error(err.message);
      }
      setLoading(false);
    }
  };

  const confirmAdmin = async () => {
    if (confirm("Are you sure you want to make these members admins?")) {
      setLoading(true);
      try {
        const res = await manageAdmin(groupID, select.members, true);
        if (!res.status) throw new Error(res.error);
        toast.success("Great, new admins here!");
        router.refresh();
      } catch (err: any) {
        toast.error(err.message);
      }
      setLoading(false);
    }
  };

  const confirmRemAdmin = async () => {
    if (
      confirm("Are you sure you want to remove permissions from these members?")
    ) {
      setLoading(true);
      try {
        const res = await manageAdmin(groupID, select.members, false);
        if (!res.status) throw new Error(res.error);
        toast.success("Well, that was unfortunate for those members.");
        router.refresh();
      } catch (err: any) {
        toast.error(err.message);
      }
      setLoading(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (actions === "Book In") {
        await confirmBookIn();
      } else if (actions === "Book Out") {
        await confirmBookOut();
      } else if (actions === "Mark as On-Course") {
        await confirmCourse();
      } else if (actions === "Unmark as On-Course") {
        await confirmUncourse();
      } else if (actions === "Remove from Group") {
        await confirmRemove();
      } else if (actions === "Make Admin") {
        await confirmAdmin();
      } else if (actions === "Remove Admin") {
        await confirmRemAdmin();
      }
      reset();
      handleReload(router);
    } catch (err: any) {
      toast.error(err.message);
    }
    setLoading(false);
    reset();
  };
  return { loading, select, handleSubmit, setSelect, setActions };
}
