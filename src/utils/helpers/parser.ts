export function getSimple(json: Object) {
  return JSON.parse(JSON.stringify(json));
}
