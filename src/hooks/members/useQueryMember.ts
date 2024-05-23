import { getMembersData } from "@/src/utils/members/SetStatistics";
import { MEMBER_SCHEMA } from "@/src/utils/schemas/members";
import { useState, useEffect } from "react";

export function useQueryMember(id?: string) {
  const [query, setQuery] = useState("");
  const [members, setMembers] = useState<string[]>(id ? [id] : []);
  const [membersList, setMembersList] = useState<{
    [id: string]: MEMBER_SCHEMA;
  }>();
  const [filtered, setFiltered] = useState<string[]>([]);
  const [isDetail, setIsDetail] = useState(false);

  const handleAdd = (id: string) => {
    if (!members.includes(id)) {
      setMembers([...members, id]);
      resetQuery();
    }
  };

  const handleRemove = (user: string) => {
    setMembers((members) => members.filter((id: string) => id !== user));
  };

  useEffect(() => {
    const fetchMembers = async () => {
      const { data } = await getMembersData();
      if (data) setMembersList(data);
    };
    if (!membersList) fetchMembers();
  }, []);

  useEffect(() => {
    if (query === "") setFiltered([]);

    if (query !== "" && membersList) {
      // handle
      const lowerQuery = query.toLowerCase();
      const temp = Object.keys(membersList).filter((id: string) => {
        const idLower = id.toLowerCase();
        const name = membersList[id].displayName.toLowerCase();
        return idLower.includes(lowerQuery) || name.includes(lowerQuery);
      });
      setFiltered(temp);
    }
  }, [query]);

  const resetQuery = () => {
    setQuery("");
    setFiltered([]);
  };

  const resetQueryMember = () => {
    resetQuery();
    setMembers(id ? [id] : []);
  };

  return {
    membersList,
    members,
    isDetail,
    setIsDetail,
    query,
    setQuery,
    filtered,
    handleAdd,
    resetQueryMember,
    handleRemove,
  };
}
