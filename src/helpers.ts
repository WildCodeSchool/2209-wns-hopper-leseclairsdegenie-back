export function computeDaysBetween(date1: Date, date2: Date): number {
  return Math.floor(
    Math.abs(date1.getTime() - date2.getTime()) / (1000 * 60 * 60 * 24)
  );
}

export function mergeObjects(o1: object, o2: object): object {
  const result = {};
  for (const key of Object.keys(o1)) {
    result[key] = o1[key];
  }
  for (const key of Object.keys(o2)) {
    result[key] = o2[key];
  }
  return result;
}
