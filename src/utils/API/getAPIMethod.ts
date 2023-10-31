export function getMethod(url: string) {
  const urlArray = url.split("/");
  const length = urlArray.length;
  return { option: urlArray[5] };
}
