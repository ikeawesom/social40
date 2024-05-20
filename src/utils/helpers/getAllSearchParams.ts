import { useSearchParams } from "next/navigation";

export default function useGetAllSearchParams() {
  const values = {} as { [id: string]: string };
  const searchParams = useSearchParams();

  for (const key of searchParams.keys()) {
    const value = searchParams.get(key);
    values[key] = value ?? "";
  }

  return { values };
}
