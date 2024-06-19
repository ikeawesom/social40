import React from "react";
import { Metadata } from "next";
import {
  CreditsRoleType,
  EXECUTIVES,
  SPECIAL_THANKS,
  TECHNICALS,
} from "@/src/utils/credits";
import HRow from "@/src/components/utils/HRow";
import CreditNameSection from "@/src/components/credits/CreditNameSection";

export const metadata: Metadata = {
  title: "Credits",
};

export default function CreditsPage() {
  return (
    <div className="grid place-items-center w-full">
      <div className="w-full max-w-[600px] p-2">
        <h1 className="md:text-5xl sm:text-6xl text-4xl text-custom-dark-text/90 mb-6">
          Meet the Team behind{" "}
          <span className="font-bold text-custom-dark-text">
            Social
            <span className="text-custom-primary">40</span>
          </span>
          .
        </h1>
        <div className="flex flex-col items-start justify-start gap-6 w-full fade-in-bottom">
          {EXECUTIVES.sort((a, b) => a.importance - b.importance).map(
            (member: CreditsRoleType, index: number) => {
              return <CreditNameSection key={index} member={member} />;
            }
          )}
        </div>
        <HRow className="my-6" />
        <h1 className="md:text-3xl sm:text-2xl text-xl mb-6">Lead Roles</h1>
        <div className="flex flex-col items-start justify-start gap-6 w-full fade-in-bottom">
          {TECHNICALS.sort((a, b) => a.importance - b.importance).map(
            (member: CreditsRoleType, index: number) => {
              return <CreditNameSection key={index} member={member} />;
            }
          )}
        </div>
        <HRow className="my-6" />
        <h1 className="md:text-3xl sm:text-2xl text-xl mb-6">Special Thanks</h1>
        <div className="flex flex-wrap items-start justify-evenly gap-6 w-full fade-in-bottom">
          {SPECIAL_THANKS.sort((a, b) => a.importance - b.importance).map(
            (member: CreditsRoleType, index: number) => {
              return <CreditNameSection small key={index} member={member} />;
            }
          )}
        </div>
        <HRow className="my-6" />
        <h1 className="md:text-3xl sm:text-2xl text-xl mb-6">Final Words</h1>
        <p className="mt-6 text-custom-dark-text/80">
          We extend our heartfelt gratitude to all those who have contributed to
          Social40's growth through testing, enforcing guidelines, suggesting
          features, and offering support. As Social40 continues growing, we
          remain deeply appreciative of our dedicated community's invaluable
          contributions. Your feedback, ideas, and encouragement have been
          instrumental in shaping Social40 into a better experience for all. We
          are committed to actively listening and incorporating your suggestions
          in order to provide an exceptional tracking platform for all.
        </p>
      </div>
    </div>
  );
}
