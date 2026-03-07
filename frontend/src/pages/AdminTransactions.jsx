import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

const AdminTransactions = () => {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [limit] = useState(50);
  const [totalPages, setTotalPages] = useState(1);

  const [filterEmployee, setFilterEmployee] = useState("");
  const [filterFlagged, setFilterFlagged] = useState(false);

  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await API.get("/transactions/employees/");
        setEmployees(res.data);
      } catch (err) {
        console.error("Error fetching employees:", err.message);
      }
    };
    fetchEmployees();
  }, []);

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      try {
        const params = {
          page,
          limit,
          flagged: filterFlagged || undefined,
          employee_id: filterEmployee ? String(filterEmployee) : undefined,
        };
        const res = await API.get("/transactions/admin/", { params });
        setTransactions(res.data.results);
        setTotalPages(res.data.total_pages);
      } catch (err) {
        console.error("Error fetching transactions:", err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, [page, limit, filterEmployee, filterFlagged]);

  const handleTransactionAction = async (id, action) => {
    try {
      await API.post(`/transactions/${id}/review/`, { action });
      setModalVisible(false);
      setSelectedTransaction(null);
      setPage(1);
    } catch (err) {
      console.error("Error updating transaction:", err.message);
    }
  };

  const getRiskColor = (score) => {
    if (score === null || score === undefined) return "#aaa";
    if (score >= 70) return "#cc0000";
    if (score >= 40) return "#999";
    return "#071e07";
  };

  const getStatusColor = (status) => {
    if (status === "Flagged") return "#cc0000";
    if (status === "Blocked") return "#999";
    if (status === "Approved") return "#071e07";
    return "#aaa";
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
            fontSize: "0.68rem", letterSpacing: "0.2em", color: "#ccc",
            paddingLeft: "0.75rem", borderLeft: "1px solid #e8e8e8",
          }}>
            ALL TRANSACTIONS
          </span>
        </div>
        <button
          onClick={() => navigate("/admin")}
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
            ADMINISTRATION
          </p>
          <h1 style={{ fontSize: "2.4rem", fontWeight: "900", color: "#0a0a0a", lineHeight: 1.1, margin: 0 }}>
            All Transactions
          </h1>
          <p style={{ fontSize: "0.85rem", color: "#999", marginTop: "0.5rem", letterSpacing: "0.02em" }}>
            Review and manage all employee transactions
          </p>
        </div>

        {/* ── FILTERS ── */}
        <div style={{
          display: "flex", gap: "1.5rem", alignItems: "center",
          marginBottom: "2rem", flexWrap: "wrap",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <span style={{ fontSize: "0.68rem", letterSpacing: "0.2em", color: "#999" }}>EMPLOYEE</span>
            <select
              value={filterEmployee}
              onChange={(e) => setFilterEmployee(e.target.value)}
              style={{
                padding: "0.5rem 0.75rem",
                border: "1px solid #e8e8e8",
                borderRadius: "3px",
                fontSize: "0.82rem",
                fontFamily: "'Georgia', serif",
                color: "#0a0a0a",
                backgroundColor: "#fff",
                outline: "none",
                cursor: "pointer",
              }}
            >
              <option value="">All Employees</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id.toString()}>{emp.username}</option>
              ))}
            </select>
          </div>

          <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={filterFlagged}
              onChange={(e) => setFilterFlagged(e.target.checked)}
              style={{ accentColor: "#071e07", width: 14, height: 14 }}
            />
            <span style={{ fontSize: "0.68rem", letterSpacing: "0.2em", color: "#999" }}>FLAGGED ONLY</span>
          </label>
        </div>

        {/* ── TABLE ── */}
        <div style={{ border: "1px solid #e8e8e8", borderRadius: "4px", overflow: "hidden", marginBottom: "2rem" }}>
          {loading ? (
            <div style={{ padding: "3rem", textAlign: "center", color: "#ccc", fontSize: "0.82rem", letterSpacing: "0.2em" }}>
              LOADING...
            </div>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "'Georgia', serif" }}>
              <thead>
                <tr style={{ backgroundColor: "#fafafa", borderBottom: "1px solid #e8e8e8" }}>
                  {["DATE", "EMPLOYEE", "AMOUNT", "TYPE", "STATUS", "DESCRIPTION", "FLAG REASON", "RISK SCORE", "ACTION"].map((col) => (
                    <th key={col} style={{
                      padding: "0.9rem 1rem", textAlign: "left",
                      fontSize: "0.62rem", letterSpacing: "0.25em",
                      color: "#bbb", fontWeight: "normal",
                    }}>
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {transactions.length === 0 ? (
                  <tr>
                    <td colSpan="9" style={{ padding: "3rem", textAlign: "center", color: "#ccc", fontSize: "0.85rem" }}>
                      No transactions found.
                    </td>
                  </tr>
                ) : (
                  transactions.map((txn, i) => (
                    <tr key={txn.id} style={{
                      borderBottom: i < transactions.length - 1 ? "1px solid #f0f0f0" : "none",
                      transition: "background 0.15s",
                    }}
                      onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#fafafa"}
                      onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#fff"}
                    >
                      <td style={{ padding: "1rem", fontSize: "0.8rem", color: "#999" }}>
                        {new Date(txn.transaction_date).toLocaleDateString()}
                      </td>
                      <td style={{ padding: "1rem", fontSize: "0.85rem", color: "#0a0a0a", fontWeight: "bold" }}>
                        {txn.employee?.username || "N/A"}
                      </td>
                      <td style={{ padding: "1rem", fontSize: "0.88rem", color: "#0a0a0a", fontWeight: "bold" }}>
                        {txn.amount}
                      </td>
                      <td style={{ padding: "1rem", fontSize: "0.82rem", color: "#999" }}>
                        {txn.transaction_type}
                      </td>
                      <td style={{ padding: "1rem" }}>
                        <span style={{
                          fontSize: "0.65rem", letterSpacing: "0.15em",
                          fontWeight: "bold", color: getStatusColor(txn.status),
                        }}>
                          {txn.status?.toUpperCase()}
                        </span>
                      </td>
                      <td style={{ padding: "1rem", fontSize: "0.82rem", color: "#999" }}>
                        {txn.description}
                      </td>
                      <td style={{ padding: "1rem", fontSize: "0.78rem", color: "#cc0000" }}>
                        {txn.flag_reason || "—"}
                      </td>
                      <td style={{ padding: "1rem", fontSize: "0.88rem", fontWeight: "bold", color: getRiskColor(txn.final_risk_score) }}>
                        {txn.final_risk_score ?? "—"}
                      </td>
                      <td style={{ padding: "1rem" }}>
                        {txn.status === "Flagged" && (
                          <button
                            onClick={() => { setSelectedTransaction(txn); setModalVisible(true); }}
                            style={{
                              backgroundColor: "#071e07", color: "#fff", border: "none",
                              borderRadius: "3px", padding: "0.35rem 0.8rem",
                              cursor: "pointer", fontSize: "0.7rem",
                              letterSpacing: "0.1em", fontFamily: "'Georgia', serif",
                              transition: "background 0.2s ease",
                            }}
                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#0f3a0f"}
                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#071e07"}
                          >
                            Review
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* ── PAGINATION ── */}
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
      </main>

      {/* ── MODAL ── */}
      {modalVisible && selectedTransaction && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: "rgba(0,0,0,0.4)",
          display: "flex", justifyContent: "center", alignItems: "center",
          zIndex: 200,
        }}>
          <div style={{
            backgroundColor: "#ffffff",
            border: "1px solid #e8e8e8",
            borderRadius: "4px",
            padding: "2.5rem",
            width: "480px",
            boxShadow: "0 8px 40px rgba(0,0,0,0.12)",
            fontFamily: "'Georgia', serif",
          }}>
            <p style={{ fontSize: "0.68rem", letterSpacing: "0.4em", color: "#071e07", marginBottom: "0.5rem" }}>
              TRANSACTION REVIEW
            </p>
            <h3 style={{ fontSize: "1.3rem", fontWeight: "900", color: "#0a0a0a", marginBottom: "1.5rem" }}>
              Review Transaction
            </h3>

            <div style={{ marginBottom: "1.5rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <p style={{ fontSize: "0.85rem", color: "#555" }}><strong style={{ color: "#0a0a0a" }}>ID:</strong> {selectedTransaction.transaction_id}</p>
              <p style={{ fontSize: "0.85rem", color: "#555" }}><strong style={{ color: "#0a0a0a" }}>Amount:</strong> {selectedTransaction.amount} {selectedTransaction.currency}</p>
              <p style={{ fontSize: "0.85rem", color: "#555" }}><strong style={{ color: "#0a0a0a" }}>Description:</strong> {selectedTransaction.description}</p>
              <p style={{ fontSize: "0.85rem", color: "#555" }}><strong style={{ color: "#0a0a0a" }}>Employee:</strong> {selectedTransaction.employee?.username}</p>
            </div>

            {/* Risk Breakdown */}
            <div style={{
              border: "1px solid #e8e8e8",
              borderRadius: "3px",
              padding: "1.2rem",
              marginBottom: "1.5rem",
              backgroundColor: "#fafafa",
            }}>
              <p style={{ fontSize: "0.65rem", letterSpacing: "0.28em", color: "#071e07", marginBottom: "1rem" }}>
                RISK BREAKDOWN
              </p>

              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.6rem" }}>
                <span style={{ fontSize: "0.82rem", color: "#777" }}>Rule-Based Score:</span>
                <strong style={{ fontSize: "0.85rem", color: getRiskColor(selectedTransaction.risk_score) }}>
                  {selectedTransaction.risk_score ?? "N/A"} / 100
                </strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.6rem" }}>
                <span style={{ fontSize: "0.82rem", color: "#777" }}>ML Fraud Probability:</span>
                <strong style={{
                  fontSize: "0.85rem",
                  color: selectedTransaction.fraud_probability > 0.7 ? "#cc0000"
                       : selectedTransaction.fraud_probability > 0.4 ? "#999"
                       : "#071e07"
                }}>
                  {selectedTransaction.fraud_probability_percent ?? "N/A"}
                </strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.8rem" }}>
                <span style={{ fontSize: "0.82rem", color: "#777" }}>Final Risk Score:</span>
                <strong style={{ fontSize: "0.85rem", color: getRiskColor(selectedTransaction.final_risk_score) }}>
                  {selectedTransaction.final_risk_score ?? "N/A"} / 100
                </strong>
              </div>

              <div style={{ borderTop: "1px solid #e8e8e8", paddingTop: "0.75rem" }}>
                <span style={{ fontSize: "0.72rem", color: "#aaa", letterSpacing: "0.05em" }}>Flag Reason: </span>
                <span style={{ fontSize: "0.78rem", color: "#cc0000" }}>
                  {selectedTransaction.flag_reason || "No rule violations — flagged by ML model"}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: "flex", gap: "0.75rem" }}>
              <button
                onClick={() => handleTransactionAction(selectedTransaction.id, "approve")}
                style={{
                  backgroundColor: "#071e07", color: "#fff", border: "none",
                  borderRadius: "3px", padding: "0.7rem 1.5rem",
                  cursor: "pointer", fontSize: "0.78rem",
                  letterSpacing: "0.1em", fontFamily: "'Georgia', serif",
                  transition: "background 0.2s ease",
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#0f3a0f"}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#071e07"}
              >
                Approve
              </button>
              <button
                onClick={() => handleTransactionAction(selectedTransaction.id, "block")}
                style={{
                  backgroundColor: "transparent", color: "#cc0000",
                  border: "1px solid #f5cccc", borderRadius: "3px",
                  padding: "0.7rem 1.5rem", cursor: "pointer",
                  fontSize: "0.78rem", letterSpacing: "0.1em",
                  fontFamily: "'Georgia', serif", transition: "all 0.2s ease",
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#fff5f5"}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = "transparent"}
              >
                Block
              </button>
              <button
                onClick={() => { setModalVisible(false); setSelectedTransaction(null); }}
                style={{
                  backgroundColor: "transparent", color: "#aaa",
                  border: "1px solid #e8e8e8", borderRadius: "3px",
                  padding: "0.7rem 1.5rem", cursor: "pointer",
                  fontSize: "0.78rem", letterSpacing: "0.1em",
                  fontFamily: "'Georgia', serif", transition: "all 0.2s ease",
                }}
                onMouseOver={(e) => e.currentTarget.style.borderColor = "#aaa"}
                onMouseOut={(e) => e.currentTarget.style.borderColor = "#e8e8e8"}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

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

export default AdminTransactions;