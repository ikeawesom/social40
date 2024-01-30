import { useEffect, useState } from "react";

export default function useQueryObj({
  obj,
  type,
}: {
  obj: any;
  type?: string;
}) {
  const [itemList, setItemList] = useState<any>(obj);
  const [search, setSearch] = useState("");
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  useEffect(() => {
    setTimeout(() => {
      if (search !== "") {
        if (type === undefined) {
          // query by ID
          const filtered = Object.keys(obj).filter((memberID) =>
            memberID.toLowerCase().includes(search.toLowerCase())
          );
          let filteredObj = {} as any;
          filtered.forEach((item: string) => {
            filteredObj[item] = obj[item];
          });

          setItemList(filteredObj);
        } else {
          // query by object properties
          let filteredObj = {} as any;
          Object.keys(obj).forEach((key: string) => {
            const itemData = obj[key];
            const propertyValue = itemData[type];
            if (propertyValue.toLowerCase().includes(search.toLowerCase())) {
              filteredObj[key] = obj[key];
            }
            const filtered = Object.keys(obj).filter((memberID) =>
              memberID.toLowerCase().includes(search.toLowerCase())
            );
            filtered.forEach((item: string) => {
              filteredObj[item] = obj[item];
            });
          });
          setItemList(filteredObj);
        }
      } else {
        setItemList(obj);
      }
    }, 400);
  }, [search]);

  return { search, handleSearch, itemList };
}
