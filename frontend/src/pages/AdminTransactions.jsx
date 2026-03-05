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
        const token = localStorage.getItem("access");
        const res = await API.get("/transactions/employees/", {
          headers: { Authorization: `Bearer ${token}` },
        });
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
        const token = localStorage.getItem("access");
        const params = {
          page,
          limit,
          flagged: filterFlagged || undefined,
          employee_id: filterEmployee ? String(filterEmployee) : undefined,
        };
        const res = await API.get("/transactions/admin/", {
          headers: { Authorization: `Bearer ${token}` },
          params,
        });
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
      const token = localStorage.getItem("access");
      await API.post(
        `/transactions/${id}/review/`,
        { action },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setModalVisible(false);
      setSelectedTransaction(null);
      setPage(1);
    } catch (err) {
      console.error("Error updating transaction:", err.message);
    }
  };

  // Helper: color based on final_risk_score
  const getRiskColor = (score) => {
    if (score === null || score === undefined) return "#888";
    if (score >= 70) return "red";
    if (score >= 40) return "orange";
    return "green";
  };

  // Helper: color based on status
  const getStatusColor = (status) => {
    if (status === "Flagged") return "red";
    if (status === "Blocked") return "darkred";
    if (status === "Approved") return "green";
    return "gray";
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#ffffff", padding: "2rem" }}>

      {/* Navbar */}
      <div style={{
        width: "100%",
        height: "60px",
        backgroundColor: "#013220",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 20px",
        color: "#ffffff",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      }}>
        <span style={{ fontWeight: "bold", fontSize: "1.2rem" }}>
          All Transactions
        </span>
        <button
          onClick={() => navigate("/admin")}
          style={{
            backgroundColor: "#ffffff",
            color: "#013220",
            border: "none",
            borderRadius: "5px",
            padding: "0.5rem 1rem",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Back
        </button>
      </div>

      {/* Filters */}
      <div style={{ margin: "1rem 0", display: "flex", gap: "0.5rem", alignItems: "center" }}>
        <span style={{ fontWeight: "bold", color: "#013220" }}>Filter by Employee:</span>
        <select
          value={filterEmployee}
          onChange={(e) => setFilterEmployee(e.target.value)}
          style={{ padding: "0.3rem 0.5rem", borderRadius: "4px" }}
        >
          <option value="">All Employees</option>
          {employees.map((emp) => (
            <option key={emp.id} value={emp.id.toString()}>
              {emp.username}
            </option>
          ))}
        </select>

        <label style={{ marginLeft: "1rem" }}>
          <input
            type="checkbox"
            checked={filterFlagged}
            onChange={(e) => setFilterFlagged(e.target.checked)}
            style={{ marginRight: "0.3rem" }}
          />
          <span style={{ fontWeight: "bold", color: "#013220" }}>Flagged Only</span>
        </label>
      </div>

      {/* Table */}
      <div style={{ overflowX: "auto", borderRadius: "8px" }}>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ backgroundColor: "#077a50", color: "#ffffff" }}>
                <th style={{ padding: "0.6rem" }}>Date</th>
                <th style={{ padding: "0.6rem" }}>Employee</th>
                <th style={{ padding: "0.6rem" }}>Amount</th>
                <th style={{ padding: "0.6rem" }}>Type</th>
                <th style={{ padding: "0.6rem" }}>Status</th>
                <th style={{ padding: "0.6rem" }}>Description</th>
                <th style={{ padding: "0.6rem" }}>Flag Reason</th>
                {/* ✅ final_risk_score replaces old risk_score */}
                <th style={{ padding: "0.6rem" }}>Final Risk Score</th>
                <th style={{ padding: "0.6rem" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan="9" style={{ textAlign: "center", padding: "1rem", color: "#000" }}>
                    No transactions found.
                  </td>
                </tr>
              ) : (
                transactions.map((txn) => (
                  <tr key={txn.id} style={{ borderBottom: "1px solid #ddd", backgroundColor: "#f9f9f9", color: "#000" }}>
                    <td style={{ padding: "0.6rem" }}>
                      {new Date(txn.transaction_date).toLocaleDateString()}
                    </td>
                    <td style={{ padding: "0.6rem" }}>{txn.employee?.username || "N/A"}</td>
                    <td style={{ padding: "0.6rem" }}>{txn.amount}</td>
                    <td style={{ padding: "0.6rem" }}>{txn.transaction_type}</td>

                    {/* ✅ Status with color */}
                    <td style={{
                      padding: "0.6rem",
                      color: getStatusColor(txn.status),
                      fontWeight: "bold"
                    }}>
                      {txn.status}
                    </td>

                    <td style={{ padding: "0.6rem" }}>{txn.description}</td>

                    {/* ✅ Flag reason — shows why rules fired */}
                    <td style={{ padding: "0.6rem", color: "#8B0000", fontSize: "0.85rem" }}>
                      {txn.flag_reason || "—"}
                    </td>

                    {/* ✅ Final risk score with color coding */}
                    <td style={{
                      padding: "0.6rem",
                      fontWeight: "bold",
                      color: getRiskColor(txn.final_risk_score)
                    }}>
                      {txn.final_risk_score ?? "N/A"}
                    </td>

                    <td style={{ padding: "0.6rem" }}>
                      {txn.status === "Flagged" && (
                        <button
                          onClick={() => { setSelectedTransaction(txn); setModalVisible(true); }}
                          style={{
                            backgroundColor: "#013220",
                            color: "#fff",
                            border: "none",
                            borderRadius: "4px",
                            padding: "0.3rem 0.6rem",
                            cursor: "pointer",
                          }}
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

      {/* Pagination */}
      <div style={{ marginTop: "1rem", display: "flex", gap: "1rem", alignItems: "center" }}>
        <button disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</button>
        <span>Page {page} of {totalPages}</span>
        <button disabled={page >= totalPages} onClick={() => setPage(page + 1)}>Next</button>
      </div>

      {/* Modal */}
      {modalVisible && selectedTransaction && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: "rgba(0,0,0,0.5)",
          display: "flex", justifyContent: "center", alignItems: "center",
        }}>
          <div style={{
            backgroundColor: "#0e0101",
            padding: "2rem",
            borderRadius: "8px",
            width: "450px",
            color: "#ffffff",
          }}>
            <h3 style={{ marginBottom: "1rem" }}>Review Transaction</h3>

            {/* Basic Info */}
            <p><strong>ID:</strong> {selectedTransaction.transaction_id}</p>
            <p><strong>Amount:</strong> {selectedTransaction.amount} {selectedTransaction.currency}</p>
            <p><strong>Description:</strong> {selectedTransaction.description}</p>
            <p><strong>Employee:</strong> {selectedTransaction.employee?.username}</p>

            {/* ✅ Risk Breakdown Section */}
            <div style={{
              backgroundColor: "#1a1a1a",
              padding: "1rem",
              borderRadius: "6px",
              marginTop: "1rem",
              marginBottom: "1rem",
            }}>
              <h4 style={{ color: "#077a50", marginBottom: "0.75rem" }}>Risk Breakdown</h4>

              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.4rem" }}>
                <span>Rule-Based Score:</span>
                <strong style={{ color: getRiskColor(selectedTransaction.risk_score) }}>
                  {selectedTransaction.risk_score ?? "N/A"} / 100
                </strong>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.4rem" }}>
                <span>ML Fraud Probability:</span>
                <strong style={{
                  color: selectedTransaction.fraud_probability > 0.7 ? "red"
                       : selectedTransaction.fraud_probability > 0.4 ? "orange"
                       : "lightgreen"
                }}>
                  {selectedTransaction.fraud_probability_percent ?? "N/A"}
                </strong>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.4rem" }}>
                <span>Final Risk Score:</span>
                <strong style={{ color: getRiskColor(selectedTransaction.final_risk_score) }}>
                  {selectedTransaction.final_risk_score ?? "N/A"} / 100
                </strong>
              </div>

              <div style={{ marginTop: "0.75rem", padding: "0.5rem", backgroundColor: "#2a2a2a", borderRadius: "4px" }}>
                <span style={{ color: "#aaa", fontSize: "0.85rem" }}>Flag Reason: </span>
                <span style={{ color: "#ff6b6b", fontSize: "0.85rem" }}>
                  {selectedTransaction.flag_reason || "No rule violations — flagged by ML model"}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: "flex", gap: "1rem" }}>
              <button
                onClick={() => handleTransactionAction(selectedTransaction.id, "approve")}
                style={{
                  backgroundColor: "#228B22", color: "#ffffff",
                  border: "none", padding: "0.5rem 1rem",
                  borderRadius: "5px", cursor: "pointer", fontWeight: "bold",
                }}
              >
                Approve
              </button>

              <button
                onClick={() => handleTransactionAction(selectedTransaction.id, "block")}
                style={{
                  backgroundColor: "#8B0000", color: "#ffffff",
                  border: "none", padding: "0.5rem 1rem",
                  borderRadius: "5px", cursor: "pointer", fontWeight: "bold",
                }}
              >
                Block
              </button>

              <button
                onClick={() => { setModalVisible(false); setSelectedTransaction(null); }}
                style={{
                  backgroundColor: "#555", color: "#ffffff",
                  border: "none", padding: "0.5rem 1rem",
                  borderRadius: "5px", cursor: "pointer", fontWeight: "bold",
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTransactions;