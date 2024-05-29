import { useState } from "react";

export function usePageNum() {
  const [page, setPage] = useState(0);
  const nextPage = () => setPage((page) => page + 1);
  const prevPage = () => setPage((page) => page - 1);
  const resetPage = () => setPage(0);

  return { page, nextPage, prevPage, resetPage };
}
