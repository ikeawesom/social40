import { useEffect, useState } from "react";
import { GroupDetailsType } from "../components/groups/custom/GroupMembers";

export default function useQueryObj(obj: any) {
  const [itemList, setItemList] = useState<GroupDetailsType>(obj);
  const [search, setSearch] = useState("");
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  useEffect(() => {
    setTimeout(() => {
      if (search !== "") {
        const filtered = Object.keys(obj).filter((memberID) =>
          memberID.toLowerCase().includes(search.toLowerCase())
        );
        let filteredObj = {} as any;
        filtered.forEach((item: string) => {
          filteredObj[item] = obj[item];
        });

        setItemList(filteredObj);
      } else {
        setItemList(obj);
      }
    }, 400);
  }, [search]);

  return { search, handleSearch, itemList };
}
