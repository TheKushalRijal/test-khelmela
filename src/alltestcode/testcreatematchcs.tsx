import axios from "axios";

/* ================= UI ROW TYPE ================= */

export type UITestRow = {
  name: string;
  expected: string;
  output: string;
  status: "pass" | "fail";
};

/* ================= HARD-CODED FRONTEND DATA ================= */

// 🔑 SAME token frontend uses (NO "Bearer " prefix)
const TEST_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5M2M2MTVjNWI1YWM3MzE1MzZlODI4YiIsImlhdCI6MTc2NzkzMjc3MCwiZXhwIjoxNzcwNTI0NzcwfQ.4IGJ5EdEY7MxweHhGvZGC3yoNnyDpN9M0kK-G7cbr98";

// same gameName prop passed to modal
const GAME_NAME = "FreeFire";

/* ================= MATCH DETAILS (FRONTEND SHAPE) ================= */

const FRONTEND_MATCH_DETAILS = {
  showDetail: true,
  player: "1v1",
  ammo: "No",
  headshot: "No",
  skill: "No",
  round: 15,
  coin: "Default",
  match: "clashsquad",
  gunAttributes: "No",
  gameName: GAME_NAME,
  betAmount: "10", // ⚠️ STRING, exactly like frontend
  selectCharacter: {
    characterMode: "ALL",
    allowedCharacters: [],
  },
  selectItem: {
    compulsoryWeapons: [],
    compulsoryArmor: [],
  },
};

/* ================= TEST CASES ================= */

const createCsFrontendTestCases = [
  {
    name: "Create CS match with frontend payload (valid)",
    body: { matchDetails: FRONTEND_MATCH_DETAILS },
    expectedStatus: 200,
  },
  {
    name: "Create CS match with betAmount < 10",
    body: {
      matchDetails: {
        ...FRONTEND_MATCH_DETAILS,
        betAmount: "5",
      },
    },
    expectedStatus: 400,
  },
  {
    name: "Create CS match without token",
    body: { matchDetails: FRONTEND_MATCH_DETAILS },
    noAuth: true,
    expectedStatus: 401,
  },
];

/* ================= TEST RUNNER ================= */

export async function runCreateCsFrontendTests(
  BASE_URL: string
): Promise<UITestRow[]> {
  const results: UITestRow[] = [];

  for (const test of createCsFrontendTestCases) {
    try {
      const response = await axios.post(
  `${BASE_URL}/khelmela/games/khelmela/createCSMatches`,
        test.body,
        {
          headers: test.noAuth
            ? {}
            : { Authorization: `${TEST_TOKEN}` }, // EXACT frontend behavior
          timeout: 8000,
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





