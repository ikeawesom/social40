export function getMethod(url: string) {
  const urlArray = url.split("/");
  return { option: urlArray[5] };
}
