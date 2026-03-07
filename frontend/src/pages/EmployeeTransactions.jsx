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
    if (status === "Flagged") return "red";
    if (status === "Blocked") return "darkred";
    if (status === "Approved") return "#00ff7f";
    return "#00ff7f";
  };

  const getRiskColor = (score) => {
    if (score >= 70) return "red";
    if (score >= 40) return "orange";
    return "#00ff7f";
  };

  const paginated = transactions.slice((page - 1) * limit, page * limit);
  const totalPages = Math.ceil(transactions.length / limit);

  if (loading) return <p style={{ padding: "2rem" }}>Loading transactions...</p>;

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#ffffff" }}>
      {/* Navbar */}
      <div style={{
        width: "100%", height: "60px", backgroundColor: "#013220",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 20px", color: "#ffffff", boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
      }}>
        <span style={{ fontWeight: "bold", fontSize: "1.2rem" }}>
          {isFlaggedView ? "Flagged Transactions" : "My Transactions"}
        </span>
        <button
          onClick={() => navigate("/dashboard")}
          style={{
            backgroundColor: "#ffffff", color: "#013220", border: "none",
            borderRadius: "5px", padding: "0.5rem 1rem", cursor: "pointer", fontWeight: "bold"
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#e6e6e6")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#ffffff")}
        >
          ← Back
        </button>
      </div>

      <div style={{ padding: "2rem" }}>
        <p style={{ color: "#555", marginBottom: "1rem" }}>
          Showing {paginated.length} of {transactions.length} transactions
        </p>

        <div style={{
          backgroundColor: "#0a4d1b", boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
          borderRadius: "8px", overflowX: "auto"
        }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ backgroundColor: "#013220", color: "#ffffff" }}>
                <th style={{ padding: "10px", textAlign: "left" }}>Date</th>
                <th style={{ padding: "10px", textAlign: "left" }}>Amount</th>
                <th style={{ padding: "10px", textAlign: "left" }}>Type</th>
                <th style={{ padding: "10px", textAlign: "left" }}>Status</th>
                <th style={{ padding: "10px", textAlign: "left" }}>Description</th>
                <th style={{ padding: "10px", textAlign: "left" }}>Final Risk Score</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center", padding: "10px", color: "#ffffff" }}>
                    No transactions found.
                  </td>
                </tr>
              ) : (
                paginated.map((txn) => (
                  <tr key={txn.id} style={{ borderBottom: "1px solid #1f6b2d" }}>
                    <td style={{ padding: "10px", color: "#ffffff" }}>{new Date(txn.transaction_date).toLocaleDateString()}</td>
                    <td style={{ padding: "10px", color: "#ffffff" }}>{txn.amount}</td>
                    <td style={{ padding: "10px", color: "#ffffff" }}>{txn.transaction_type}</td>
                    <td style={{ padding: "10px", color: getStatusColor(txn.status), fontWeight: "bold" }}>{txn.status}</td>
                    <td style={{ padding: "10px", color: "#ffffff" }}>{txn.description}</td>
                    <td style={{ padding: "10px", fontWeight: "bold", color: getRiskColor(txn.final_risk_score) }}>{txn.final_risk_score ?? "N/A"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div style={{ marginTop: "1rem", display: "flex", gap: "1rem", alignItems: "center" }}>
            <button
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
              style={{
                backgroundColor: "#013220", color: "#fff", border: "none",
                padding: "0.5rem 1rem", borderRadius: "5px", cursor: page <= 1 ? "not-allowed" : "pointer",
                opacity: page <= 1 ? 0.5 : 1
              }}
            >
              Previous
            </button>
            <span style={{ color: "#013220", fontWeight: "bold" }}>Page {page} of {totalPages}</span>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage(page + 1)}
              style={{
                backgroundColor: "#013220", color: "#fff", border: "none",
                padding: "0.5rem 1rem", borderRadius: "5px", cursor: page >= totalPages ? "not-allowed" : "pointer",
                opacity: page >= totalPages ? 0.5 : 1
              }}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeTransactions;