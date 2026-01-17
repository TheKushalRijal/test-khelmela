import React, { useEffect, useState } from "react";
import { runAllTestsForUI } from "./functioncalling";

/* ================= TYPES ================= */

type UITestRow = {
  name: string;
  expected: string;
  output: string;
  status: "pass" | "fail" | "pending";
};

/* ================= COMPONENT ================= */

export default function TestCasesPage() {
  const [tests, setTests] = useState<UITestRow[]>([
    {
      name: "Running tests...",
      expected: "-",
      output: "-",
      status: "pending",
    },
  ]);

  useEffect(() => {
    async function loadTests() {
      try {
        // Show pending rows immediately
        setTests([
          {
            name: "Executing all test cases",
            expected: "-",
            output: "-",
            status: "pending",
          },
        ]);

        const results = await runAllTestsForUI();

        // Replace pending rows with real results
        setTests(results);
      } catch (error: any) {
        setTests([
          {
            name: "Test runner error",
            expected: "-",
            output: error?.message || "Unknown error",
            status: "fail",
          },
        ]);
      }
    }

    loadTests();
  }, []);

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* HEADER */}
        <div style={{ ...styles.row, ...styles.header }}>
          <div style={styles.cell}>Test name</div>
          <div style={styles.cell}>Expected data</div>
          <div style={styles.cell}>Output data</div>
          <div style={styles.cell}>Verification</div>
        </div>

        {/* ROWS */}
        {tests.map((test, index) => (
          <div key={`${test.name}-${index}`} style={styles.row}>
            <div style={styles.cell}>{test.name}</div>
            <div style={styles.cell}>{test.expected}</div>
            <div style={styles.cell}>{test.output}</div>
            <div style={styles.cell}>
              <StatusBadge status={test.status} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ================= STATUS BADGE ================= */

function StatusBadge({ status }: { status: UITestRow["status"] }) {
  const map = {
    pass: { text: "PASS", color: "#22c55e" },
    fail: { text: "FAIL", color: "#ef4444" },
    pending: { text: "RUNNING", color: "#eab308" },
  };

  return (
    <span
      style={{
        padding: "6px 14px",
        borderRadius: "999px",
        fontWeight: "bold",
        fontSize: 12,
        backgroundColor: map[status].color,
        color: "#000",
      }}
    >
      {map[status].text}
    </span>
  );
}

/* ================= STYLES ================= */

const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#000000",
    padding: 40,
    fontFamily: "system-ui, sans-serif",
  },
  container: {
    backgroundColor: "#4d4f52",
    borderRadius: 40,
    padding: 20,
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },
  row: {
    backgroundColor: "#646c7e",
    borderRadius: 30,
    padding: "16px 20px",
    display: "grid",
    gridTemplateColumns: "1.2fr 1.5fr 1.5fr 1fr",
    alignItems: "center",
  },
  header: {
    backgroundColor: "#000000",
    fontWeight: "bold",
  },
  cell: {
    padding: "4px 8px",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    color: "#ffffff",
  },
};
