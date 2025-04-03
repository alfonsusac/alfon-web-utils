export function splitFirst(str: string, delimiter: string) {
  const [first, ...rest] = str.split(delimiter);
  return [first, rest.join(delimiter)];
}