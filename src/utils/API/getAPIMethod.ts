export function getMethod(url: string) {
  const urlArray = url.split("/");
  const method = urlArray[urlArray.length - 1];
  return method;
}
