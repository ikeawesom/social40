import PokerGame from "@/src/components/game/poker/PokerGame";
import { GAMES_LIST } from "@/src/utils/constants";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function GameIDPage({
  params,
}: {
  params: { id: string };
}) {
  const gameID = params.id;
  if (!Object.keys(GAMES_LIST).includes(gameID)) redirect("/home");
  const token = cookies().get("token");
  if (!token) redirect("/home");
  return <PokerGame member={token.value} />;
}
