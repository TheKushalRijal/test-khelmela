import { runLoginTests } from "./alltestcode/login";
import { runSigninTests } from "./alltestcode/signup";
import { runCreateCsTests } from "./alltestcode/cs_matchcard";
import { runDeleteCardTests } from "./alltestcode/cs_matchcard";
import { runJoinUserTests } from "./alltestcode/testmatchjoin";
import { TEST_TOKENS, jointokens } from "./tokens";

const BASE_URL = "http://192.168.1.153:8080";

export async function runAllTestsForUI() {
  const results: any[] = [];

  // run non-auth tests once
  const [loginResults, signinResults] = await Promise.all([
    runLoginTests(BASE_URL),
    runSigninTests(BASE_URL),
  ]);

  results.push(...loginResults, ...signinResults);

  // create → join → delete
  for (let i = 0; i < TEST_TOKENS.length; i++) {
    const hostToken = TEST_TOKENS[i];
    const joinToken = jointokens[i]; // opponent token

    // CREATE
    const { results: createResults, createdMatchIds } =
      await runCreateCsTests(BASE_URL, hostToken);

    results.push(...createResults);

    // JOIN (only if join token exists)
    if (joinToken && createdMatchIds.length > 0) {
      const joinResults = await runJoinUserTests(
        BASE_URL,
        joinToken,
        createdMatchIds
      );
      results.push(...joinResults);
    }

    // DELETE (host deletes)
    if (createdMatchIds.length > 0) {
      const deleteResults = await runDeleteCardTests(
        BASE_URL,
        hostToken,
        createdMatchIds
      );
      results.push(...deleteResults);
    }
  }

  return results;
}
