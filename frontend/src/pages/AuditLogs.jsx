import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

const AuditLogs = () => {
  const navigate = useNavigate();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterAction, setFilterAction] = useState("");

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("access");
        const res = await API.get("/transactions/audit-logs/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLogs(res.data);
      } catch (err) {
        console.error("Error fetching audit logs:", err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  // Action color coding
  const getActionColor = (action) => {
    if (action === "APPROVE") return "#228B22";
    if (action === "BLOCK") return "#8B0000";
    if (action === "ML_SCORE") return "#007bff";
    if (action === "CREATE") return "#077a50";
    return "#888";
  };

  // Filter logs by action
  const filteredLogs = filterAction
    ? logs.filter((log) => log.action === filterAction)
    : logs;

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
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      }}>
        <span style={{ fontWeight: "bold", fontSize: "1.2rem" }}>
          Audit Logs
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

      {/* Filter */}
      <div style={{ margin: "1rem 2rem", display: "flex", gap: "0.5rem", alignItems: "center" }}>
        <span style={{ fontWeight: "bold", color: "#013220" }}>Filter by Action:</span>
        <select
          value={filterAction}
          onChange={(e) => setFilterAction(e.target.value)}
          style={{ padding: "0.3rem 0.5rem", borderRadius: "4px" }}
        >
          <option value="">All Actions</option>
          <option value="CREATE">CREATE</option>
          <option value="ML_SCORE">ML_SCORE</option>
          <option value="APPROVE">APPROVE</option>
          <option value="BLOCK">BLOCK</option>
        </select>

        {/* Log count */}
        <span style={{ marginLeft: "1rem", color: "#555", fontSize: "0.9rem" }}>
          Showing {filteredLogs.length} logs
        </span>
      </div>

      {/* Table */}
      <div style={{ overflowX: "auto", padding: "0 2rem" }}>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ backgroundColor: "#077a50", color: "#ffffff" }}>
                <th style={{ padding: "0.75rem", textAlign: "left" }}>Timestamp</th>
                <th style={{ padding: "0.75rem", textAlign: "left" }}>Transaction ID</th>
                <th style={{ padding: "0.75rem", textAlign: "left" }}>Performed By</th>
                <th style={{ padding: "0.75rem", textAlign: "left" }}>Action</th>
                <th style={{ padding: "0.75rem", textAlign: "left" }}>Details</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center", padding: "1rem", color: "#000" }}>
                    No logs found.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log, index) => (
                  <tr
                    key={index}
                    style={{
                      borderBottom: "1px solid #ddd",
                      backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#ffffff",
                      color: "#000",
                    }}
                  >
                    {/* Timestamp */}
                    <td style={{ padding: "0.75rem", fontSize: "0.85rem", color: "#555" }}>
                      {new Date(log.timestamp).toLocaleString()}
                    </td>

                    {/* Transaction ID */}
                    <td style={{ padding: "0.75rem", fontSize: "0.85rem", fontFamily: "monospace" }}>
                      {log.transaction_id || "—"}
                    </td>

                    {/* Performed By */}
                    <td style={{ padding: "0.75rem" }}>
                      {log.user === "SYSTEM" ? (
                        <span style={{ color: "#077a50", fontWeight: "bold" }}>SYSTEM</span>
                      ) : (
                        log.user
                      )}
                    </td>

                    {/* Action with color coding */}
                    <td style={{ padding: "0.75rem" }}>
                      <span style={{
                        backgroundColor: getActionColor(log.action),
                        color: "#ffffff",
                        padding: "0.2rem 0.6rem",
                        borderRadius: "4px",
                        fontSize: "0.8rem",
                        fontWeight: "bold",
                      }}>
                        {log.action}
                      </span>
                    </td>

                    {/* Details */}
                    <td style={{ padding: "0.75rem", fontSize: "0.85rem", color: "#333" }}>
                      {log.details || "—"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AuditLogs;