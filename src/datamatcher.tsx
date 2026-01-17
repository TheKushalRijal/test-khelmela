export function matchExpectedData(actual: any, expected: any): boolean {
  if (expected === undefined) return true;        // don’t care
  if (expected === null) return actual === null;

  if (typeof expected === "object") {
    return Object.keys(expected).every(
      (key) => actual?.[key] === expected[key]
    );
  }

  return actual === expected;
}
