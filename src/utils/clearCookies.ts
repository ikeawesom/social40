export async function clearCookies(host: string) {
  await fetch(`${host}/api/auth`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ strategy: "DEL" }),
  });
}
