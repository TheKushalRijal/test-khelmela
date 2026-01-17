// testTypes.ts
export type UITestRow = {
  name: string;
  expected: string;
  output: string;
  status: "pass" | "fail";
};
