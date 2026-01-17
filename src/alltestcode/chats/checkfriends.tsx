import axios from "axios";

/* ================= UI ROW TYPE ================= */

export type UITestRow = {
  name: string;
  expected: string;
  output: string;
  status: "pass" | "fail";
};

/* ================= CONFIG ================= */

// 🔑 JWT of logged-in test user
const TEST_JWT =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.REAL.TEST.TOKEN";

// 🧑 Another real user ID (not self)
const TEST_FRIEND_ID = "64f0c123abc456def789012";

/* ================= TEST CASES ================= */

const friendRequestTestCases = [
  {
    name: "Send friend request successfully",
    body: { friendId: TEST_FRIEND_ID },
    expectedStatus: 200,
  },
  {
    name: "Send friend request without friendId",
    body: {},
    expectedStatus: 400,
  },
  {
    name: "Send friend request to self",
    body: { friendId: "SELF" }, // replaced at runtime
    expectedStatus: 400,
  },
  {
    name: "Send duplicate friend request",
    body: { friendId: TEST_FRIEND_ID },
    expectedStatus: 400,
  },
  {
    name: "Send friend request without JWT",
    body: { friendId: TEST_FRIEND_ID },
    noAuth: true,
    expectedStatus: 401,
  },
];

/* ================= TEST RUNNER ================= */

export async function runSendFriendRequestTests(
  BASE_URL: string,
  USER_ID: string // pass real logged-in userId
): Promise<UITestRow[]> {
  const results: UITestRow[] = [];

  for (const test of friendRequestTestCases) {
    try {
      const requestBody =
        test.body.friendId === "SELF"
          ? { friendId: USER_ID }
          : test.body;

      const response = await axios.post(
        `${BASE_URL}/send-friend-request`,
        requestBody,
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
