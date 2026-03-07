import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../api";
import React from "react";

function EmployeeDashboard() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [stats, setStats] = useState({
    total_transactions: 0,
    flagged_transactions: 0,
    normal_transactions: 0,
  });
  const [recentTransactions, setRecentTransactions] = useState([]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await API.get("transactions/users/me/");
        setUsername(res.data.username);
      } catch (err) {
        console.log("Error fetching user:", err.response?.data);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await API.get("transactions/stats/");
        setStats(res.data);
      } catch (err) {
        console.log("Error fetching stats:", err.response?.data);
      }
    };
    fetchStats();
  }, []);

  useEffect(() => {
    const fetchRecentTransactions = async () => {
      try {
        const res = await API.get("transactions/?limit=5");
        setRecentTransactions(res.data);
      } catch (err) {
        console.log("Error fetching transactions:", err.response?.data);
      }
    };
    fetchRecentTransactions();
  }, []);

  const handleLogout = async () => {
    await API.post("token/logout/");
    navigate("/");
  };

  const getStatusColor = (status) => {
    if (status === "Flagged") return "#cc0000";
    if (status === "Blocked") return "#666";
    if (status === "Approved") return "#071e07";
    return "#071e07";
  };

  const getRiskColor = (score) => {
    if (score >= 70) return "#cc0000";
    if (score >= 40) return "#666";
    return "#071e07";
  };

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "#ffffff",
      fontFamily: "'Georgia', serif",
      color: "#0a0a0a",
    }}>

      {/* ── NAVBAR ── */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 100,
        backgroundColor: "rgba(255,255,255,0.97)",
        borderBottom: "1px solid #e8e8e8",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "1.2rem 4rem", boxSizing: "border-box",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div style={{ width: 9, height: 9, backgroundColor: "#071e07", borderRadius: "50%" }} />
          <span style={{ fontSize: "0.9rem", letterSpacing: "0.2em", color: "#071e07", fontWeight: "bold" }}>
            SMARTEXPENSE
          </span>
          <span style={{
            fontSize: "0.68rem", letterSpacing: "0.2em", color: "#999",
            paddingLeft: "0.75rem", borderLeft: "1px solid #e8e8e8",
          }}>
            EMPLOYEE PORTAL
          </span>
        </div>
        <button
          onClick={handleLogout}
          style={{
            backgroundColor: "transparent", color: "#aaa", border: "none",
            cursor: "pointer", fontSize: "0.78rem", letterSpacing: "0.12em",
            fontFamily: "'Georgia', serif", transition: "color 0.2s ease",
          }}
          onMouseOver={(e) => e.currentTarget.style.color = "#071e07"}
          onMouseOut={(e) => e.currentTarget.style.color = "#aaa"}
        >
          Sign out →
        </button>
      </nav>

      {/* ── MAIN ── */}
      <main style={{ maxWidth: 1140, margin: "0 auto", padding: "4rem 4rem 6rem" }}>

        {/* Header */}
        <div style={{ marginBottom: "3.5rem", paddingBottom: "2.5rem", borderBottom: "1px solid #f0f0f0" }}>
          <p style={{ fontSize: "0.68rem", letterSpacing: "0.4em", color: "#071e07", marginBottom: "0.6rem" }}>
            EMPLOYEE DASHBOARD
          </p>
          <h1 style={{ fontSize: "2.4rem", fontWeight: "900", color: "#0a0a0a", lineHeight: 1.1, margin: 0 }}>
            Welcome  {username}.
          </h1>
          <p style={{ fontSize: "0.85rem", color: "#534b4b", marginTop: "0.5rem", letterSpacing: "0.02em" }}>
            Your transaction activity and account overview
          </p>
        </div>

        {/* ── STATS GRID ── */}
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(3, 1fr)",
          gap: "1px", backgroundColor: "#e8e8e8",
          border: "1px solid #e8e8e8", marginBottom: "4rem",
        }}>
          {[
            { label: "TOTAL TRANSACTIONS", value: stats.total_transactions, note: "All time" },
            { label: "FLAGGED", value: stats.flagged_transactions, note: "Under review" },
            { label: "NORMAL", value: stats.normal_transactions, note: "Cleared" },
          ].map((s, i) => (
            <div key={i}
              style={{ backgroundColor: "#fff", padding: "2.5rem 2rem", cursor: "default", transition: "background 0.2s" }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#f9faf9"}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#fff"}
            >
              <p style={{ fontSize: "0.65rem", letterSpacing: "0.28em", color: "#bbb", marginBottom: "1.2rem" }}>{s.label}</p>
              <p style={{ fontSize: "3rem", fontWeight: "900", color: "#071e07", lineHeight: 1, marginBottom: "0.5rem" }}>{s.value}</p>
              <p style={{ fontSize: "0.75rem", color: "#ccc", letterSpacing: "0.05em" }}>{s.note}</p>
            </div>
          ))}
        </div>

        {/* ── SUBMIT TRANSACTION ── */}
        <div style={{ marginBottom: "4rem" }}>
          <p style={{ fontSize: "0.68rem", letterSpacing: "0.4em", color: "#071e07", marginBottom: "0.4rem" }}>SUBMIT</p>
          <h2 style={{ fontSize: "1.3rem", fontWeight: "900", color: "#0a0a0a", marginBottom: "1.5rem" }}>
            New Transaction
          </h2>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <button
              onClick={() => navigate("/manual")}
              style={{
                backgroundColor: "#071e07", color: "#fff", border: "none",
                borderRadius: "3px", padding: "0.85rem 2rem", cursor: "pointer",
                fontSize: "0.8rem", letterSpacing: "0.12em", fontFamily: "'Georgia', serif",
                transition: "background 0.2s ease",
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#0f3a0f"}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#071e07"}
            >
              Manual Entry →
            </button>
            <button
              onClick={() => navigate("/upload")}
              style={{
                backgroundColor: "transparent", color: "#071e07",
                border: "1px solid #d8d8d8", borderRadius: "3px",
                padding: "0.85rem 2rem", cursor: "pointer",
                fontSize: "0.8rem", letterSpacing: "0.12em", fontFamily: "'Georgia', serif",
                transition: "border-color 0.2s ease",
              }}
              onMouseOver={(e) => e.currentTarget.style.borderColor = "#071e07"}
              onMouseOut={(e) => e.currentTarget.style.borderColor = "#d8d8d8"}
            >
              Upload CSV →
            </button>
          </div>
        </div>

        {/* ── RECENT TRANSACTIONS ── */}
        <div>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: "1.5rem" }}>
            <div>
              <p style={{ fontSize: "0.68rem", letterSpacing: "0.4em", color: "#071e07", marginBottom: "0.4rem" }}>ACTIVITY</p>
              <h2 style={{ fontSize: "1.3rem", fontWeight: "900", color: "#0a0a0a", margin: 0 }}>Recent Transactions</h2>
            </div>
            <span style={{ fontSize: "0.75rem", color: "#888", letterSpacing: "0.05em" }}>Last 5 entries</span>
          </div>

          <div style={{ border: "1px solid #e8e8e8", borderRadius: "4px", overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "'Georgia', serif" }}>
              <thead>
                <tr style={{ backgroundColor: "#fafafa", borderBottom: "1px solid #e8e8e8" }}>
                  {["DATE", "AMOUNT", "TYPE", "STATUS", "DESCRIPTION", "RISK SCORE"].map((col) => (
                    <th key={col} style={{
                      padding: "0.9rem 1.5rem", textAlign: "left",
                      fontSize: "0.62rem", letterSpacing: "0.25em",
                      color: "#888", fontWeight: "normal",
                    }}>
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentTransactions.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ padding: "3rem", textAlign: "center", color: "#999", fontSize: "0.85rem" }}>
                      No transactions found.
                    </td>
                  </tr>
                ) : (
                  recentTransactions.map((txn, i) => (
                    <tr key={txn.id} style={{
                      borderBottom: i < recentTransactions.length - 1 ? "1px solid #f0f0f0" : "none",
                      transition: "background 0.15s",
                    }}
                      onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#fafafa"}
                      onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#fff"}
                    >
                      <td style={{ padding: "1.1rem 1.5rem", fontSize: "0.8rem", color: "#666" }}>
                        {new Date(txn.transaction_date).toLocaleDateString()}
                      </td>
                      <td style={{ padding: "1.1rem 1.5rem", fontSize: "0.9rem", color: "#0a0a0a", fontWeight: "bold" }}>
                        {txn.amount}
                      </td>
                      <td style={{ padding: "1.1rem 1.5rem", fontSize: "0.82rem", color: "#666" }}>
                        {txn.transaction_type}
                      </td>
                      <td style={{ padding: "1.1rem 1.5rem" }}>
                        <span style={{
                          fontSize: "0.65rem", letterSpacing: "0.15em",
                          fontWeight: "bold", color: getStatusColor(txn.status),
                        }}>
                          {txn.status?.toUpperCase()}
                        </span>
                      </td>
                      <td style={{ padding: "1.1rem 1.5rem", fontSize: "0.82rem", color: "#666" }}>
                        {txn.description}
                      </td>
                      <td style={{ padding: "1.1rem 1.5rem", fontSize: "0.88rem", fontWeight: "bold", color: getRiskColor(txn.final_risk_score) }}>
                        {txn.final_risk_score ?? "—"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* View more */}
          <div style={{ display: "flex", gap: "1rem", marginTop: "1.5rem", flexWrap: "wrap" }}>
            <button
              onClick={() => navigate("/employee/transactions")}
              style={{
                backgroundColor: "#071e07", color: "#fff", border: "none",
                borderRadius: "3px", padding: "0.85rem 2rem", cursor: "pointer",
                fontSize: "0.8rem", letterSpacing: "0.12em", fontFamily: "'Georgia', serif",
                transition: "background 0.2s ease",
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#0f3a0f"}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#071e07"}
            >
              View All →
            </button>
            <button
              onClick={() => navigate("/employee/transactions?flagged=true")}
              style={{
                backgroundColor: "transparent", color: "#cc0000",
                border: "1px solid #f5cccc", borderRadius: "3px",
                padding: "0.85rem 2rem", cursor: "pointer",
                fontSize: "0.8rem", letterSpacing: "0.12em", fontFamily: "'Georgia', serif",
                transition: "all 0.2s ease",
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#fff5f5"}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = "transparent"}
            >
              View Flagged →
            </button>
          </div>
        </div>
      </main>

      {/* ── FOOTER ── */}
      <footer style={{
        borderTop: "1px solid #e8e8e8", padding: "1.8rem 4rem",
        display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <div style={{ width: 7, height: 7, backgroundColor: "#071e07", borderRadius: "50%" }} />
          <span style={{ fontSize: "0.78rem", color: "#071e07", letterSpacing: "0.15em" }}>SMARTEXPENSE</span>
        </div>
        <span style={{ fontSize: "0.68rem", color: "#999", letterSpacing: "0.1em" }}>FRAUD DETECTION SYSTEM © 2025</span>
      </footer>

      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @media (max-width: 768px) {
          nav, footer { padding-left: 1.5rem !important; padding-right: 1.5rem !important; }
          main { padding: 2rem 1.5rem 4rem !important; }
          div[style*="repeat(3, 1fr)"] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

export default EmployeeDashboard;