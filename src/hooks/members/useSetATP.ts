import { useState } from "react";

export function useSetATP() {
  const [score, setScore] = useState(0);
  const resetScore = () => setScore(0);
  return { score, setScore, resetScore };
}
