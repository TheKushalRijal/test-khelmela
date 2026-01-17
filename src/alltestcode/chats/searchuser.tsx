import axios from "axios";

/* ================= UI ROW TYPE ================= */

export type UITestRow = {
  name: string;
  expected: string;
  output: string;
  status: "pass" | "fail";
};

/* ================= CONFIG ================= */

// 🔑 REAL JWT (must belong to an existing user)
const TEST_JWT =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.REAL.TEST.TOKEN";

/* ================= TEST CASES ================= */

const searchUserTestCases = [
  {
    name: "Search users with valid name",
    body: { name: "admin" },
    expectedStatus: 200,
  },
  {
    name: "Search users with no matching name",
    body: { name: "nonexistentuserxyz" },
    expectedStatus: 200,
  },
  {
    name: "Search users without name",
    body: {},
    expectedStatus: 400,
  },
  {
    name: "Search users without JWT",
    body: { name: "admin" },
    noAuth: true,
    expectedStatus: 401,
  },
];

/* ================= TEST RUNNER ================= */

export async function runSearchUsersTests(
  BASE_URL: string
): Promise<UITestRow[]> {
  const results: UITestRow[] = [];

  for (const test of searchUserTestCases) {
    try {
      const response = await axios.post(
        `${BASE_URL}/search-users`,
        test.body,
        {
          headers: test.noAuth
            ? {}
            : { Authorization: `Bearer ${TEST_JWT}` },
          timeout: 5000,
        }
      );

      results.push({
        name: test.name,
        expected: `Status ${test.expectedStatus}`,
        output: `Status ${response.status}`,
        status:
          response.status === test.expectedStatus ? "pass" : "fail",
      });
    } catch (error: any) {
      const status = error?.response?.status;

      results.push({
        name: test.name,
        expected: `Status ${test.expectedStatus}`,
        output: `Status ${status}`,
        status:
          status === test.expectedStatus ? "pass" : "fail",
      });
    }
  }

  return results;
}
