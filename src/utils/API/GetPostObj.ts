export function GetPostObj(args: Object) {
  return {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(args),
    cache: "no-store" as "no-store",
  };
}
