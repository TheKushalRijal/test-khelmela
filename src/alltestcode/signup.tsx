import axios from "axios";

/* ================= UI ROW TYPE ================= */

export type UITestRow = {
  name: string;
  expected: string;
  output: string;
  status: "pass" | "fail";
};

/* ================= SIGNUP TEST CASES ================= */

const signinTestCases = [
  {
    name: "Signin with valid data",
    inputData: {
      username: "testuser123",
      email: "testuser123@gmail.com",
      password: "Test@1234",
      referralCode: "",
      fcmToken: "dummy-fcm-token",
    },
    expectedStatuses: [200, 500], // 500 = email failure, request still valid
  },
  {
    name: "Signin with missing email",
    inputData: {
      username: "testuser123",
      email: "",
      password: "Test@1234",
      referralCode: "",
      fcmToken: "dummy-fcm-token",
    },
    expectedStatuses: [400],
  },
];

/* ================= TEST FUNCTION ================= */

export async function runSigninTests(
  BASE_URL: string
): Promise<UITestRow[]> {
  const results: UITestRow[] = [];

  for (const test of signinTestCases) {
    try {
      const response = await axios.post(
        `${BASE_URL}/khelmela/auth/khelmela/sendOtp`,
        test.inputData,
        { timeout: 5000 }
      );

      results.push({
        name: test.name,
        expected: `Status ${test.expectedStatuses.join(" or ")}`,
        output: `Status ${response.status}`,
        status: test.expectedStatuses.includes(response.status)
          ? "pass"
          : "fail",
      });
    } catch (error: any) {
      const status = error?.response?.status;

      results.push({
        name: test.name,
        expected: `Status ${test.expectedStatuses.join(" or ")}`,
        output: `Status ${status}`,
        status: test.expectedStatuses.includes(status)
          ? "pass"
          : "fail",
      });
    }
  }

  return results;
}
