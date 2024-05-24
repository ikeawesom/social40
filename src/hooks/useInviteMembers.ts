import { useState } from "react";
import { useHostname } from "./useHostname";
import { useRouter } from "next/navigation";

export function useInviteMembers() {
  const router = useRouter();
  const { host } = useHostname();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [members, setMembers] = useState<string[]>([]);

  const resetErrors = () => setErrors([]);

  return {
    resetErrors,
    router,
    host,
    loading,
    setLoading,
    errors,
    setErrors,
    members,
    setMembers,
  };
}
