import axios from "axios";
import { matchExpectedData } from "../datamatcher";

const FULL_MATCH_DETAILS = {
  showDetail: true,
  player: "1v1",
  ammo: "No",
  headshot: "No",
  skill: "No",
  round: 15,
  coin: "Default",
  match: "clashsquad",
  gunAttributes: "No",
  gameName: "TEST_GAME_NAME",
  betAmount: 10,
  selectCharacter: {
    characterMode: "ALL",
    allowedCharacters: [],
  },
  selectItem: {
    compulsoryWeapons: [],
    compulsoryArmor: [],
  },
};

const createCsTestCases = [
  {
    name: "Create CS match with valid data",
    payload: { matchDetails: FULL_MATCH_DETAILS },
    expectedStatus: 200,
    expectedData: {
      status: "pending",
      totalPlayers: 1,
      customId: "",
      customPassword: "",
      matchDetails: [FULL_MATCH_DETAILS],
    },
  },
  {
    name: "Create CS match with missing matchDetails",
    payload: {},
    expectedStatus: 400,
    expectedData: undefined,
  },
  {
    name: "Create CS match with insufficient balance",
    payload: {
      matchDetails: { ...FULL_MATCH_DETAILS, betAmount: 999999 },
    },
    expectedStatus: 400,
    expectedData: undefined,
  },
];

export async function runCreateCsTests(
  BASE_URL: string,
  token: string
): Promise<{ results: UITestRow[]; createdMatchIds: string[] }> {
  const results: UITestRow[] = [];
  const createdMatchIds: string[] = [];

  for (const test of createCsTestCases) {
    await new Promise<void>((done) => {
      axios
        .post(
          `${BASE_URL}/khelmela/games/khelmela/createCSMatches`,
          test.payload,
          {
            timeout: 5000,
            headers: { Authorization: token },
          }
        )
        .then((response) => {
          const newMatch = response.data?.newMatch;

          if (response.status === 200 && newMatch?._id) {
            createdMatchIds.push(newMatch._id); // 🔴 CAPTURE ID
          }

          let dataMatches = true;
          if (test.expectedData) {
            dataMatches =
              matchExpectedData(newMatch, test.expectedData) &&
              JSON.stringify(newMatch?.matchDetails?.[0]) ===
                JSON.stringify(test.expectedData.matchDetails?.[0]);
          }

          results.push({
            name: test.name,
            expected: `Status ${test.expectedStatus}`,
            output: `Status ${response.status}`,
            status:
              response.status === test.expectedStatus && dataMatches
                ? "pass"
                : "fail",
          });

          done();
        })
        .catch((error) => {
          const status = error?.response?.status;
          results.push({
            name: test.name,
            expected: `Status ${test.expectedStatus}`,
            output: `Status ${status}`,
            status:
              status === test.expectedStatus ? "pass" : "fail",
          });
          done();
        });
    });
  }

  return { results, createdMatchIds };
}







export type UITestRow = {
  name: string;
  expected: string;
  output: string;
  status: "pass" | "fail";
};

const deleteCardTestCases = [
  {
    name: "Delete card with valid token and matchId",
    payload: {
      matchId: "VALID_MATCH_ID",
    },
    expectedStatus: 200,
  },
  {
    name: "Delete card with missing matchId",
    payload: {},
    expectedStatus: 400,
  },
  {
    name: "Delete card with invalid matchId",
    payload: {
      matchId: "INVALID_MATCH_ID",
    },
    expectedStatus: 400,
  },
];
export async function runDeleteCardTests(
  BASE_URL: string,
  token: string,
  matchIds: string[]
): Promise<UITestRow[]> {
  const results: UITestRow[] = [];

  for (const matchId of matchIds) {
    await new Promise<void>((done) => {
      axios
        .post(
          `${BASE_URL}/khelmela/deletecard`,
          { matchId },
          {
            timeout: 5000,
            headers: { Authorization: token },
          }
        )
        .then((response) => {
          results.push({
            name: `Delete card ${matchId}`,
            expected: "Status 200",
            output: `Status ${response.status}`,
            status: response.status === 200 ? "pass" : "fail",
          });
          done();
        })
        .catch((error) => {
          const status = error?.response?.status;
          results.push({
            name: `Delete card ${matchId}`,
            expected: "Status 200",
            output: `Status ${status}`,
            status: "fail",
          });
          done();
        });
    });
  }

  return results;
}

