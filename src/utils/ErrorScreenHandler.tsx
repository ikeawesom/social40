import React from "react";
import NotFoundScreen from "../components/screens/NotFoundScreen";
import OfflineScreen from "../components/screens/OfflineScreen";
import ServerErrorScreen from "../components/screens/ServerErrorScreen";

export default function ErrorScreenHandler(err: any) {
  const error = err.message;
  if (error.includes("offline")) return <OfflineScreen />;
  if (error.includes("not found")) return <NotFoundScreen error={error} />;
  else return <ServerErrorScreen eMsg={error} />;
}
