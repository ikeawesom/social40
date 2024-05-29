"use client";

import React from "react";

export default function ProgressProvider({
  children,
  valueEnd,
  valueStart,
}: {
  valueStart: number;
  valueEnd: number;
  children: any;
}) {
  const [value, setValue] = React.useState(valueStart);
  React.useEffect(() => {
    setValue(valueEnd);
  }, [valueEnd]);

  return children(value);
}
