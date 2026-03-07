import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../api";

const EmployeeTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const limit = 50;

  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const isFlaggedView = queryParams.get("flagged") === "true";

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      try {
        const response = await api.get(`transactions/?limit=1000`);

        let data = response.data;

        if (isFlaggedView) {
          data = data.filter((txn) => txn.status === "Flagged" || txn.status === "Blocked");
        }

        setTransactions(data);
        setHasMore(data.length === limit);
      } catch (error) {
        console.error("Error fetching transactions:", error.response || error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [isFlaggedView]);

  const getStatusColor = (status) => {
    if (status === "Flagged") return "#cc0000";
    if (status === "Blocked") return "#999";
    if (status === "Approved") return "#071e07";
    return "#071e07";
  };

  const getRiskColor = (score) => {
    if (score >= 70) return "#cc0000";
    if (score >= 40) return "#999";
    return "#071e07";
  };

  const paginated = transactions.slice((page - 1) * limit, page * limit);
  const totalPages = Math.ceil(transactions.length / limit);

  if (loading) return (
    <div style={{
      minHeight: "100vh", backgroundColor: "#ffffff",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "'Georgia', serif", fontSize: "0.82rem",
      letterSpacing: "0.2em", color: "#aaa",
    }}>
      LOADING...
    </div>
  );

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
            fontSize: "0.68rem", letterSpacing: "0.2em", color: "#ccc",
            paddingLeft: "0.75rem", borderLeft: "1px solid #e8e8e8",
          }}>
            {isFlaggedView ? "FLAGGED TRANSACTIONS" : "MY TRANSACTIONS"}
          </span>
        </div>
        <button
          onClick={() => navigate("/dashboard")}
          style={{
            backgroundColor: "transparent", color: "#aaa", border: "none",
            cursor: "pointer", fontSize: "0.78rem", letterSpacing: "0.12em",
            fontFamily: "'Georgia', serif", transition: "color 0.2s ease",
          }}
          onMouseOver={(e) => e.currentTarget.style.color = "#071e07"}
          onMouseOut={(e) => e.currentTarget.style.color = "#aaa"}
        >
          ← Back
        </button>
      </nav>

      {/* ── MAIN ── */}
      <main style={{ maxWidth: 1140, margin: "0 auto", padding: "4rem 4rem 6rem" }}>

        {/* Header */}
        <div style={{ marginBottom: "3.5rem", paddingBottom: "2.5rem", borderBottom: "1px solid #f0f0f0" }}>
          <p style={{ fontSize: "0.68rem", letterSpacing: "0.4em", color: "#071e07", marginBottom: "0.6rem" }}>
            {isFlaggedView ? "FLAGGED" : "ACTIVITY"}
          </p>
          <h1 style={{ fontSize: "2.4rem", fontWeight: "900", color: "#0a0a0a", lineHeight: 1.1, margin: 0 }}>
            {isFlaggedView ? "Flagged Transactions" : "My Transactions"}
          </h1>
          <p style={{ fontSize: "0.85rem", color: "#999", marginTop: "0.5rem", letterSpacing: "0.02em" }}>
            Showing {paginated.length} of {transactions.length} transactions
          </p>
        </div>

        {/* ── TABLE ── */}
        <div style={{ border: "1px solid #e8e8e8", borderRadius: "4px", overflow: "hidden", marginBottom: "2rem" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "'Georgia', serif" }}>
            <thead>
              <tr style={{ backgroundColor: "#fafafa", borderBottom: "1px solid #e8e8e8" }}>
                {["DATE", "AMOUNT", "TYPE", "STATUS", "DESCRIPTION", "RISK SCORE"].map((col) => (
                  <th key={col} style={{
                    padding: "0.9rem 1.5rem", textAlign: "left",
                    fontSize: "0.62rem", letterSpacing: "0.25em",
                    color: "#bbb", fontWeight: "normal",
                  }}>
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ padding: "3rem", textAlign: "center", color: "#ccc", fontSize: "0.85rem" }}>
                    No transactions found.
                  </td>
                </tr>
              ) : (
                paginated.map((txn, i) => (
                  <tr key={txn.id} style={{
                    borderBottom: i < paginated.length - 1 ? "1px solid #f0f0f0" : "none",
                    transition: "background 0.15s",
                  }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#fafafa"}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#fff"}
                  >
                    <td style={{ padding: "1.1rem 1.5rem", fontSize: "0.8rem", color: "#999" }}>
                      {new Date(txn.transaction_date).toLocaleDateString()}
                    </td>
                    <td style={{ padding: "1.1rem 1.5rem", fontSize: "0.9rem", color: "#0a0a0a", fontWeight: "bold" }}>
                      {txn.amount}
                    </td>
                    <td style={{ padding: "1.1rem 1.5rem", fontSize: "0.82rem", color: "#999" }}>
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
                    <td style={{ padding: "1.1rem 1.5rem", fontSize: "0.82rem", color: "#999" }}>
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

        {/* ── PAGINATION ── */}
        {totalPages > 1 && (
          <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
            <button
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
              style={{
                backgroundColor: "transparent", color: page <= 1 ? "#ccc" : "#071e07",
                border: `1px solid ${page <= 1 ? "#eee" : "#d8d8d8"}`,
                borderRadius: "3px", padding: "0.6rem 1.2rem",
                cursor: page <= 1 ? "not-allowed" : "pointer",
                fontSize: "0.78rem", letterSpacing: "0.1em",
                fontFamily: "'Georgia', serif", transition: "all 0.2s ease",
              }}
              onMouseOver={(e) => { if (page > 1) e.currentTarget.style.borderColor = "#071e07"; }}
              onMouseOut={(e) => { if (page > 1) e.currentTarget.style.borderColor = "#d8d8d8"; }}
            >
              ← Previous
            </button>
            <span style={{ fontSize: "0.78rem", color: "#999", letterSpacing: "0.1em" }}>
              PAGE {page} OF {totalPages}
            </span>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage(page + 1)}
              style={{
                backgroundColor: "transparent", color: page >= totalPages ? "#ccc" : "#071e07",
                border: `1px solid ${page >= totalPages ? "#eee" : "#d8d8d8"}`,
                borderRadius: "3px", padding: "0.6rem 1.2rem",
                cursor: page >= totalPages ? "not-allowed" : "pointer",
                fontSize: "0.78rem", letterSpacing: "0.1em",
                fontFamily: "'Georgia', serif", transition: "all 0.2s ease",
              }}
              onMouseOver={(e) => { if (page < totalPages) e.currentTarget.style.borderColor = "#071e07"; }}
              onMouseOut={(e) => { if (page < totalPages) e.currentTarget.style.borderColor = "#d8d8d8"; }}
            >
              Next →
            </button>
          </div>
        )}
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
        <span style={{ fontSize: "0.68rem", color: "#ccc", letterSpacing: "0.1em" }}>FRAUD DETECTION SYSTEM © 2025</span>
      </footer>

      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @media (max-width: 768px) {
          nav, footer { padding-left: 1.5rem !important; padding-right: 1.5rem !important; }
          main { padding: 2rem 1.5rem 4rem !important; }
        }
      `}</style>
    </div>
  );
};

export default EmployeeTransactions;