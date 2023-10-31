export function getMethod(url: string) {
  const urlArray = url.split("/");
  const length = urlArray.length;
  if (length === 7) return { option: urlArray[5], suboption: urlArray[6] };
  return { option: urlArray[5] };
}
