"use client";

import { createContext, useContext, useState } from "react";

export interface FeedbackDetailsType {
  desc: string;
  rating: number;
}

type FeedbackContextType = {
  feedbackDetails: FeedbackDetailsType | null;
  setFeedbackDetails: React.Dispatch<
    React.SetStateAction<FeedbackDetailsType | null>
  >;
};

const FeedbackContext = createContext<FeedbackContextType | null>(null);

export function FeedbackProvider({ children }: { children: React.ReactNode }) {
  const [feedbackDetails, setFeedbackDetails] =
    useState<FeedbackDetailsType | null>({
      desc: "",
      rating: 0,
    });

  return (
    <FeedbackContext.Provider value={{ feedbackDetails, setFeedbackDetails }}>
      {children}
    </FeedbackContext.Provider>
  );
}

export function useFeedbackContext() {
  const context = useContext(FeedbackContext);
  if (!context) {
    throw new Error(
      "useFeedbackContext must be used within an FeedbackCTXProvider"
    );
  }
  const { feedbackDetails, setFeedbackDetails } = context;
  const handleChange = (e: any) => {
    if (feedbackDetails)
      setFeedbackDetails({ ...feedbackDetails, desc: e.target.value });
  };
  return { feedbackDetails, setFeedbackDetails, handleChange };
}
