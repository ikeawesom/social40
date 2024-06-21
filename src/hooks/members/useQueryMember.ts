import { useState, useEffect } from "react";

export function useQueryMember({
  fetchFunction,
  secondaryKey,
  id,
}: {
  fetchFunction: () => Promise<{
    error: any;
    data: any;
    status: boolean;
  }>;
  secondaryKey?: string;
  id?: string;
}) {
  const [query, setQuery] = useState("");
  const [members, setMembers] = useState<string[]>(id ? [id] : []);
  const [membersList, setMembersList] = useState<{
    [id: string]: any;
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
      const { data } = await fetchFunction();
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
        const name = secondaryKey
          ? membersList[id][secondaryKey].toLowerCase()
          : "";
        return (
          idLower.includes(lowerQuery) ||
          (secondaryKey ? name.includes(lowerQuery) : true)
        );
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

  useEffect(() => {
    setMembers(members);
  }, [members]);

  let filteredObj = {} as any;
  if (membersList && filtered.length > 0) {
    const temp = Object.keys(membersList).filter((id: string) =>
      filtered.includes(id)
    );
    temp.forEach((id: string) => (filteredObj[id] = membersList[id]));
  }

  const isLoading = membersList === undefined;
  return {
    isLoading,
    filteredObj,
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
