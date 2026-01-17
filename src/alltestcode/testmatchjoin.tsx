import axios from "axios";

export type UITestRow = {
  name: string;
  expected: string;
  output: string;
  status: "pass" | "fail";
};

export function runJoinUserTests(
  BASE_URL: string,
  token: string,
  matchIds: string[]
): Promise<{ results: UITestRow[]; joinUserId?: string }> {
  const results: UITestRow[] = [];
  let joinUserId: string | undefined;

  return new Promise(async (resolve) => {

    /* ---------- VALID JOIN ---------- */
    for (const matchId of matchIds) {
      await new Promise<void>((done) => {
        axios
          .post(
            `${BASE_URL}/khelmela/games/khelmela/joinRequestCS`,
            { matchId },
            {
              timeout: 5000,
              headers: { Authorization: token },
            }
          )
          .then((response) => {
            joinUserId = response.data?.userId;

            results.push({
              name: `Join CS match (valid) ${matchId}`,
              expected: "Status 200",
              output: `Status ${response.status}`,
              status: response.status === 200 ? "pass" : "fail",
            });
            done();
          })
          .catch((error) => {
            const status = error?.response?.status;
            results.push({
              name: `Join CS match (valid) ${matchId}`,
              expected: "Status 200",
              output: `Status ${status}`,
              status: "fail",
            });
            done();
          });
      });
    }

    /* ---------- MISSING MATCH ID ---------- */
    await new Promise<void>((done) => {
      axios
        .post(
          `${BASE_URL}/khelmela/games/khelmela/joinRequestCS`,
          {},
          {
            timeout: 5000,
            headers: { Authorization: token },
          }
        )
        .catch((error) => {
          const status = error?.response?.status;
          results.push({
            name: "Join CS match with missing matchId",
            expected: "Status 400",
            output: `Status ${status}`,
            status: status === 400 ? "pass" : "fail",
          });
          done();
        });
    });

    /* ---------- INVALID MATCH ID ---------- */
    await new Promise<void>((done) => {
      axios
        .post(
          `${BASE_URL}/khelmela/games/khelmela/joinRequestCS`,
          { matchId: "INVALID_MATCH_ID" },
          {
            timeout: 5000,
            headers: { Authorization: token },
          }
        )
        .catch((error) => {
          const status = error?.response?.status;
          results.push({
            name: "Join CS match with invalid matchId",
            expected: "Status 400",
            output: `Status ${status}`,
            status: status === 400 ? "pass" : "fail",
          });
          done();
        });
    });

    resolve({ results, joinUserId });
  });
}



export function runAcceptJoinRequestTests(
  BASE_URL: string,
  token: string,
  matchIds: string[],
  joinUserId: string
): Promise<UITestRow[]> {
  const results: UITestRow[] = [];

  return new Promise(async (resolve) => {

    /* ---------- VALID ACCEPT ---------- */
    for (const matchId of matchIds) {
      await new Promise<void>((done) => {
        axios
          .post(
            `${BASE_URL}/khelmela/games/khelmela/accpetJoinRequest`,
            { matchId, userId: joinUserId },
            {
              timeout: 5000,
              headers: { Authorization: token },
            }
          )
          .then((response) => {
            results.push({
              name: `Accept join request (valid) ${matchId}`,
              expected: "Status 200",
              output: `Status ${response.status}`,
              status: response.status === 200 ? "pass" : "fail",
            });
            done();
          })
          .catch((error) => {
            const status = error?.response?.status;
            results.push({
              name: `Accept join request (valid) ${matchId}`,
              expected: "Status 200",
              output: `Status ${status}`,
              status: "fail",
            });
            done();
          });
      });
    }

    /* ---------- MISSING DATA ---------- */
    await new Promise<void>((done) => {
      axios
        .post(
          `${BASE_URL}/khelmela/games/khelmela/accpetJoinRequest`,
          {},
          {
            timeout: 5000,
            headers: { Authorization: token },
          }
        )
        .catch((error) => {
          const status = error?.response?.status;
          results.push({
            name: "Accept join request with missing data",
            expected: "Status 400",
            output: `Status ${status}`,
            status: status === 400 ? "pass" : "fail",
          });
          done();
        });
    });

    resolve(results);
  });
}
