"use client";

// Simple password form for /api/admin/login. On success, redirects to
// /admin — middleware.js re-checks the cookie it just received.

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || "Invalid password");
        setLoading(false);
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f4f4f5",
        padding: "1rem",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          width: "100%",
          maxWidth: 360,
          background: "#fff",
          borderRadius: 8,
          padding: "2rem",
          boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
        }}
      >
        <h1 style={{ margin: "0 0 1.5rem", fontSize: "1.25rem", textAlign: "center" }}>
          Admin Login
        </h1>

        <label htmlFor="password" style={{ display: "block", fontSize: "0.875rem", marginBottom: 6 }}>
          Password
        </label>
        <input
          id="password"
          type="password"
          autoFocus
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            width: "100%",
            padding: "0.5rem 0.75rem",
            fontSize: "1rem",
            border: "1px solid #d4d4d8",
            borderRadius: 6,
            marginBottom: "1rem",
            boxSizing: "border-box",
          }}
        />

        {error && (
          <p style={{ color: "#dc2626", fontSize: "0.875rem", margin: "0 0 1rem" }}>{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "0.6rem",
            fontSize: "1rem",
            fontWeight: 600,
            color: "#fff",
            background: loading ? "#a1a1aa" : "#18181b",
            border: "none",
            borderRadius: 6,
            cursor: loading ? "default" : "pointer",
          }}
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </div>
  );
}
