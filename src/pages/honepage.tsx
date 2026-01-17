// src/pages/HomePage.tsx
import React from "react";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#000",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <div
        style={{
          backgroundColor: "#4d4f52",
          padding: 40,
          borderRadius: 30,
          textAlign: "center",
        }}
      >
        <h1 style={{ color: "#fff", marginBottom: 20 }}>
          UI Test Runner
        </h1>

        <button
          onClick={() => navigate("/tests")}
          style={{
            padding: "12px 24px",
            borderRadius: 999,
            border: "none",
            fontWeight: "bold",
            cursor: "pointer",
            backgroundColor: "#22c55e",
          }}
        >
          Run Tests
        </button>
      </div>
    </div>
  );
}
