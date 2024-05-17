import React from "react";
import NotFoundScreen from "./screens/NotFoundScreen";
import OfflineScreen from "./screens/OfflineScreen";
import ServerErrorScreen from "./screens/ServerErrorScreen";

export default function ErrorScreenHandler(err: any) {
  const error = err.message;
  if (error.includes("offline")) return <OfflineScreen />;
  if (error.includes("not found")) return <NotFoundScreen error={error} />;
  else return <ServerErrorScreen eMsg={error} />;
}
