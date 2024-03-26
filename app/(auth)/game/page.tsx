import DefaultCard from "@/src/components/DefaultCard";
import GameCard from "@/src/components/game/GameCard";
import GameHero from "@/src/components/game/GameHero";
import { GAMES_LIST } from "@/src/utils/constants";
import Image from "next/image";

export default async function GamePage() {
  return (
    <div className="max-w-[550px] flex flex-col items-start justify-center gap-4">
      <GameHero />
      <DefaultCard className="w-full">
        <div className="w-full flex items-start justify-start flex-col gap-2">
          <h1 className="text-xl font-bold text-custom-dark-text text-start">
            Featured Games
          </h1>
          <GameLayout>
            {Object.keys(GAMES_LIST).map((id, index) => (
              <GameCard key={index} config={GAMES_LIST[id]} />
            ))}
          </GameLayout>
        </div>
      </DefaultCard>
    </div>
  );
}

function GameLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center justify-start gap-2">
      {children}
    </div>
  );
}
