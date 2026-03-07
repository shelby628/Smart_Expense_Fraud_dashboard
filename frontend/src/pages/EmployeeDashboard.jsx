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
    normal_transactions: 0
  });
  const [recentTransactions, setRecentTransactions] = useState([]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("access");
        const res = await API.get("transactions/users/me/", {
          headers: { Authorization: `Bearer ${token}` },
        });
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
        const token = localStorage.getItem("access");
        const res = await API.get("transactions/stats/", {
          headers: { Authorization: `Bearer ${token}` },
        });
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
        const token = localStorage.getItem("access");
        const res = await API.get("transactions/?limit=5", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setRecentTransactions(res.data);
      } catch (err) {
        console.log("Error fetching transactions:", err.response?.data);
      }
    };
    fetchRecentTransactions();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    navigate("/");
  };

  // ✅ consistent color for status
  const getStatusColor = (status) => {
    if (status === "Flagged") return "red";
    if (status === "Blocked") return "darkred";
    if (status === "Approved") return "#00ff7f";
    return "#00ff7f";
  };

  // ✅ color for final risk score
  const getRiskColor = (score) => {
    if (score >= 70) return "red";
    if (score >= 40) return "orange";
    return "#00ff7f";
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#ffffff" }}>
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
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
      }}>
        <span style={{ fontWeight: "bold", fontSize: "1.2rem" }}>
          Employee Dashboard
        </span>
        <button
          onClick={handleLogout}
          style={{
            backgroundColor: "#ffffff",
            color: "#013220",
            border: "none",
            borderRadius: "5px",
            padding: "0.5rem 1rem",
            cursor: "pointer",
            transition: "all 0.2s ease",
            fontWeight: "bold",
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#e6e6e6")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#ffffff")}
        >
          Logout
        </button>
      </div>

      <div style={{ padding: "2rem" }}>
        <h1 style={{ color: "#013220", marginBottom: "0.5rem" }}>
          Welcome, {username}!
        </h1>

        {/* Stats Cards */}
        <div style={{ display: "flex", gap: "1rem", marginTop: "2rem" }}>
          <div style={{
            flex: 1, padding: "1.5rem", backgroundColor: "#f0fff0",
            borderRadius: "8px", boxShadow: "0 2px 6px rgba(0,0,0,0.1)", color: "#013220"
          }}>
            <h3>Total Transactions</h3>
            <p style={{ fontSize: "1.5rem", fontWeight: "bold" }}>{stats.total_transactions}</p>
          </div>

          <div style={{
            flex: 1, padding: "1.5rem", backgroundColor: "#fff0f0",
            borderRadius: "8px", boxShadow: "0 2px 6px rgba(0,0,0,0.1)", color: "#8B0000"
          }}>
            <h3>Flagged Transactions</h3>
            <p style={{ fontSize: "1.5rem", fontWeight: "bold" }}>{stats.flagged_transactions}</p>
          </div>

          <div style={{
            flex: 1, padding: "1.5rem", backgroundColor: "#f0f0f0",
            borderRadius: "8px", boxShadow: "0 2px 6px rgba(0,0,0,0.1)", color: "#000000"
          }}>
            <h3>Normal Transactions</h3>
            <p style={{ fontSize: "1.5rem", fontWeight: "bold" }}>{stats.normal_transactions}</p>
          </div>
        </div>
       

    {/* Action Buttons */}
        <p style={{ color: "#013220", fontWeight: "bold", marginTop: "1.5rem", marginBottom: "0.5rem" }}>
          Need to make a transaction?
        </p>
        <div style={{ display: "flex", gap: "1rem" }}>
          <button
            onClick={() => navigate("/manual")}
            style={{
              backgroundColor: "#013220", color: "#ffffff", border: "none",
              padding: "0.6rem 1.2rem", borderRadius: "5px", cursor: "pointer",
              fontWeight: "bold",
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#228B22")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#013220")}
          >
             Manual Entry
          </button>

          <button
            onClick={() => navigate("/upload")}
            style={{
              backgroundColor: "#013220", color: "#ffffff", border: "none",
              padding: "0.6rem 1.2rem", borderRadius: "5px", cursor: "pointer",
              fontWeight: "bold",
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#228B22")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#013220")}
          >
             Upload Transactions
          </button>
        </div>

        {/* Recent Transactions Table */}
        <div style={{ marginTop: "3rem" }}>
          <h2 style={{ color: "#013220", marginBottom: "1rem" }}>Recent Transactions</h2>

          <table style={{
            width: "100%", borderCollapse: "collapse",
            backgroundColor: "#0a4d1b", boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
          }}>
            <thead>
              <tr style={{ backgroundColor: "#013220", color: "#ffffff" }}>
                <th style={{ padding: "10px", textAlign: "left" }}>Date</th>
                <th style={{ padding: "10px", textAlign: "left" }}>Amount</th>
                <th style={{ padding: "10px", textAlign: "left" }}>Type</th>
                <th style={{ padding: "10px", textAlign: "left" }}>Status</th>
                <th style={{ padding: "10px", textAlign: "left" }}>Description</th>
                {/* ✅ final_risk_score instead of risk_score */}
                <th style={{ padding: "10px", textAlign: "left" }}>Final Risk Score</th>
              </tr>
            </thead>

            <tbody>
              {recentTransactions.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center", padding: "10px", color: "#ffffff" }}>
                    No transactions found.
                  </td>
                </tr>
              ) : (
                recentTransactions.map((txn) => (
                  <tr key={txn.id} style={{ borderBottom: "1px solid #1f6b2d" }}>
                    <td style={{ padding: "10px", color: "#ffffff" }}>
                      {new Date(txn.transaction_date).toLocaleDateString()}
                    </td>
                    <td style={{ padding: "10px", color: "#ffffff" }}>{txn.amount}</td>
                    <td style={{ padding: "10px", color: "#ffffff" }}>{txn.transaction_type}</td>

                    {/* ✅ use txn.status instead of txn.is_flagged */}
                    <td style={{
                      padding: "10px",
                      color: getStatusColor(txn.status),
                      fontWeight: "bold"
                    }}>
                      {txn.status}
                    </td>

                    <td style={{ padding: "10px", color: "#ffffff" }}>{txn.description}</td>

                    {/* ✅ final_risk_score with color */}
                    <td style={{
                      padding: "10px",
                      fontWeight: "bold",
                      color: getRiskColor(txn.final_risk_score)
                    }}>
                      {txn.final_risk_score ?? "N/A"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <div style={{ marginTop: "1rem", display: "flex", gap: "1rem" }}>
            <button
              onClick={() => navigate("/employee/transactions")}
              style={{
                backgroundColor: "#013220", color: "#ffffff", border: "none",
                padding: "0.6rem 1.2rem", borderRadius: "5px", cursor: "pointer",
              }}
              onMouseOver={(e) => (e.target.style.backgroundColor = "#228B22")}
              onMouseOut={(e) => (e.target.style.backgroundColor = "#013220")}
            >
              View All Transactions →
            </button>

            <button
              onClick={() => navigate("/employee/transactions?flagged=true")}
              style={{
                backgroundColor: "#013220", color: "#ffffff", border: "none",
                padding: "0.6rem 1.2rem", borderRadius: "5px", cursor: "pointer",
              }}
              onMouseOver={(e) => (e.target.style.backgroundColor = "#228B22")}
              onMouseOut={(e) => (e.target.style.backgroundColor = "#013220")}
            >
              View Flagged Transactions →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmployeeDashboard;