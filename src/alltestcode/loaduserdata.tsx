import axios from "axios";

/* ================= UI ROW TYPE ================= */

export type UITestRow = {
  name: string;
  expected: string;
  output: string;
  status: "pass" | "fail";
};

/* ================= PROFILE TEST CASES ================= */

const profileTestCases = [
  {
    name: "Get profile with valid token",
    tokenProvider: async () => {
      // 🔴 IMPORTANT: replace this with real token retrieval
      // e.g. from login test, env, or localStorage
      return localStorage.getItem("token");
    },
    expectedStatus: 200,
    checkBalance: true,
  },
  {
    name: "Get profile without token",
    tokenProvider: async () => null,
    expectedStatus: 401,
    checkBalance: false,
  },
];

/* ================= TEST FUNCTION ================= */

export async function runGetProfileTests(
  BASE_URL: string
): Promise<UITestRow[]> {
  const results: UITestRow[] = [];

  for (const test of profileTestCases) {
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5M2M2MTVjNWI1YWM3MzE1MzZlODI4YiIsImlhdCI6MTc2NzkzMjc3MCwiZXhwIjoxNzcwNTI0NzcwfQ.4IGJ5EdEY7MxweHhGvZGC3yoNnyDpN9M0kK-G7cbr98";

    try {
      const response = await axios.get(
        `${BASE_URL}/khelmela/auth/khelmela/getprofile`,
        {
          headers: token ? { Authorization: token } : undefined,
          timeout: 5000,
        }
      );

      // Status check
      if (response.status !== test.expectedStatus) {
        results.push({
          name: test.name,
          expected: `Status ${test.expectedStatus}`,
          output: `Status ${response.status}`,
          status: "fail",
        });
        continue;
      }

      // Balance check (only for valid token)
      if (test.checkBalance) {
        const balance = response.data?.data?.balance;
        if (balance === undefined || isNaN(Number(balance))) {
          results.push({
            name: test.name,
            expected: "Numeric balance",
            output: `Invalid balance: ${balance}`,
            status: "fail",
          });
          continue;
        }

        results.push({
          name: test.name,
          expected: "Valid profile with balance",
          output: `Balance ${Number(balance).toFixed(2)}`,
          status: "pass",
        });
      } else {
        results.push({
          name: test.name,
          expected: `Status ${test.expectedStatus}`,
          output: `Status ${response.status}`,
          status: "pass",
        });
      }
    } catch (error: any) {
      const status = error?.response?.status;

      results.push({
        name: test.name,
        expected: `Status ${test.expectedStatus}`,
        output: `Status ${status}`,
        status: status === test.expectedStatus ? "pass" : "fail",
      });
    }
  }

  return results;
}
