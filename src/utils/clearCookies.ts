export async function clearCookies(host: string) {
  await fetch(`${host}/api/auth/clear`, {
    method: "POST",
  });
}
