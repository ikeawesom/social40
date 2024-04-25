import React, { useState } from "react";

export function useHADetails() {
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [start, setStart] = useState({
    day: "01",
    month: "01",
    year: "2024",
  });

  const onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStart({ ...start, [e.target.name]: e.target.value });
  };

  const enable = () => setShow(true);
  const disable = () => setShow(false);

  return {
    onChange,
    enable,
    disable,
    show,
    start,
    loading,
    setLoading,
  };
}
