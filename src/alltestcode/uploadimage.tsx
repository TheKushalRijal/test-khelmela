import axios from "axios";

/* ================= UI ROW TYPE ================= */

export type UITestRow = {
  name: string;
  expected: string;
  output: string;
  status: "pass" | "fail";
};

/* ================= CONFIG ================= */

// 🔑 REAL JWT — replace with valid token
const TEST_JWT =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.REAL.TEST.TOKEN";

// very small valid base64 png (1x1 pixel)
const BASE64_IMAGE =
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/w8AAusB9Yx8pVQAAAAASUVORK5CYII=";

/* ================= TEST CASES ================= */

const uploadTestCases = [
  {
    name: "Upload image with valid data",
    headers: {
      Authorization: `Bearer ${TEST_JWT}`,
    },
    body: {
      image: BASE64_IMAGE,
      filename: "test.png",
      folderName: "profile",
    },
    expectedStatus: 200,
  },
  {
    name: "Upload image without JWT",
    headers: {},
    body: {
      image: BASE64_IMAGE,
      filename: "test.png",
      folderName: "profile",
    },
    expectedStatus: 401,
  },
  {
    name: "Upload with missing filename",
    headers: {
      Authorization: `Bearer ${TEST_JWT}`,
    },
    body: {
      image: BASE64_IMAGE,
      folderName: "profile",
    },
    expectedStatus: 400,
  },
  {
    name: "Upload with invalid file type",
    headers: {
      Authorization: `Bearer ${TEST_JWT}`,
    },
    body: {
      image: BASE64_IMAGE,
      filename: "test.exe",
      folderName: "profile",
    },
    expectedStatus: 400,
  },
];

/* ================= TEST RUNNER ================= */

export async function runUploadImageTests(
  BASE_URL: string
): Promise<UITestRow[]> {
  const results: UITestRow[] = [];

  for (const test of uploadTestCases) {
    try {
      const response = await axios.post(
        `${BASE_URL}/upload`,
        test.body,
        {
          headers: test.headers,
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
