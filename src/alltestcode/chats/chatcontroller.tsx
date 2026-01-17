import axios from "axios";

/* ================= UI ROW TYPE ================= */

export type UITestRow = {
  name: string;
  expected: string;
  output: string;
  status: "pass" | "fail";
};

/* ================= TEST CASES ================= */

const chatTestCases = [
  {
    name: "Get chat with valid roomId",
    roomId: "test-room-123", // must exist or return empty array
    expectedStatus: 200,
    expectArray: true,
  },
  {
    name: "Get chat with roomId that has no messages",
    roomId: "empty-room-999",
    expectedStatus: 200,
    expectArray: true,
  },
  {
    name: "Get chat with invalid roomId",
    roomId: null,
    expectedStatus: 404,
  },
];

/* ================= TEST RUNNER ================= */

export async function runGetChatTests(
  BASE_URL: string
): Promise<UITestRow[]> {
  const results: UITestRow[] = [];

  for (const test of chatTestCases) {
    try {
      const response = await axios.get(
        test.roomId
          ? `${BASE_URL}/chat/${test.roomId}`
          : `${BASE_URL}/chat`,
        { timeout: 5000 }
      );

      const isArrayValid =
        test.expectArray && Array.isArray(response.data);

      results.push({
        name: test.name,
        expected: `Status ${test.expectedStatus}${
          test.expectArray ? " + array" : ""
        }`,
        output: `Status ${response.status}`,
        status:
          response.status === test.expectedStatus &&
          (test.expectArray ? isArrayValid : true)
            ? "pass"
            : "fail",
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
