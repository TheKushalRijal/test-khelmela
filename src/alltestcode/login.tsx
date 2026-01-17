import axios from "axios";

/* ================= UI ROW TYPE ================= */

export type UITestRow = {
  name: string;
  expected: string;
  output: string;
  status: "pass" | "fail";
};

/* ================= LOGIN TEST CASES ================= */

const loginTestCases = [
  {
    name: "Login with valid credentials",
    inputData: {
      email: "kushalrijal27@gmail.com",
      password: "thekushal",
      fcmToken: "test-fcm-token",
    },
    expectedStatus: 200,
  },
  {
    name: "Login with wrong password",
    inputData: {
      email: "kushalrijal27@gmail.com",
      password: "wrongpassword",
      fcmToken: "test-fcm-token",
    },
    expectedStatus: 401, // backend behavior
  },
];

/* ================= TEST FUNCTION ================= */

export async function runLoginTests(
  BASE_URL: string
): Promise<UITestRow[]> {
  const results: UITestRow[] = [];

  for (const test of loginTestCases) {
    try {
      const response = await axios.post(
        `${BASE_URL}/khelmela/auth/khelmela/login`,
        test.inputData,
        { timeout: 5000 }
      );

      results.push({
        name: test.name,
        expected: `Status ${test.expectedStatus}`,
        output: `Status ${response.status}`,
        status: response.status === test.expectedStatus ? "pass" : "fail",
      });
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
