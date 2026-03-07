import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

function AdminDashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    total_transactions: 0,
    flagged_transactions: 0,
    normal_transactions: 0,
  });
  const [employees, setEmployees] = useState([]);

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    navigate("/");
  };

  const toggleStatus = async (id) => {
    try {
      const token = localStorage.getItem("access");
      const res = await API.post(
        `transactions/admin/employees/${id}/toggle/`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setEmployees((prev) =>
        prev.map((emp) =>
          emp.id === id ? { ...emp, is_active: res.data.is_active } : emp
        )
      );
    } catch (err) {
      console.log("Error toggling status:", err.response?.data || err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("access");
        const statsRes = await API.get("transactions/admin/stats/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const empRes = await API.get("transactions/admin/employees/", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setStats(statsRes.data);
        setEmployees(empRes.data);
      } catch (err) {
        console.log("Error fetching admin data:", err.response?.data || err);
      }
    };

    fetchData();
  }, []);

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#ffffff" }}>
      {/* ================= NAVBAR ================= */}
      <div
        style={{
          width: "100%",
          height: "60px",
          backgroundColor: "#013220",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 20px",
          color: "#ffffff",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        }}
      >
        <span style={{ fontWeight: "bold", fontSize: "1.2rem" }}>
          Admin Dashboard
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

      {/* ================= STATS SECTION ================= */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "1rem",
          marginTop: "2rem",
          padding: "0 2rem",
        }}
      >
        <div
          style={{
            flex: 1,
            minWidth: "200px",
            padding: "1.5rem",
            backgroundColor: "#f0fff0",
            borderRadius: "8px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
            color: "#013220",
          }}
        >
          <h3>Total Transactions</h3>
          <p style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
            {stats.total_transactions}
          </p>
        </div>

        <div
          style={{
            flex: 1,
            minWidth: "200px",
            padding: "1.5rem",
            backgroundColor: "#fff0f0",
            borderRadius: "8px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
            color: "#8B0000",
          }}
        >
          <h3>Flagged Transactions</h3>
          <p style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
            {stats.flagged_transactions}
          </p>
        </div>

        <div
          style={{
            flex: 1,
            minWidth: "200px",
            padding: "1.5rem",
            backgroundColor: "#f0f0f0",
            borderRadius: "8px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
            color: "#000000",
          }}
        >
          <h3>Normal Transactions</h3>
          <p style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
            {stats.normal_transactions}
          </p>
        </div>
      </div>

      {/* ================= EMPLOYEE MANAGEMENT ================= */}
      <div style={{ padding: "2rem" }}>
        <h2 style={{ color: "#013220", marginBottom: "1rem" }}>
          Employee Management
        </h2>

        <div
          style={{
            backgroundColor: "#0a4d1b",
            borderRadius: "8px",
            overflowX: "auto",
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
          }}
        >
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              color: "#ffffff",
            }}
          >
            <thead>
              <tr style={{ backgroundColor: "#013220" }}>
                <th style={{ padding: "12px", textAlign: "left" }}>Username</th>
                <th style={{ padding: "12px", textAlign: "left" }}>Email</th>
                <th style={{ padding: "12px", textAlign: "left" }}>Status</th>
                <th style={{ padding: "12px", textAlign: "left" }}>Action</th>
              </tr>
            </thead>

            <tbody>
              {employees.length === 0 ? (
                <tr>
                  <td
                    colSpan="4"
                    style={{ padding: "12px", textAlign: "center" }}
                  >
                    No employees found.
                  </td>
                </tr>
              ) : (
                employees.map((emp) => (
                  <tr key={emp.id} style={{ borderBottom: "1px solid #1f6b2d" }}>
                    <td style={{ padding: "12px" }}>{emp.username}</td>
                    <td style={{ padding: "12px" }}>{emp.email}</td>

                    <td
                      style={{
                        padding: "12px",
                        fontWeight: "bold",
                        color: emp.is_active ? "#00ff7f" : "#ff4d4d",
                      }}
                    >
                      {emp.is_active ? "Active" : "Inactive"}
                    </td>

                    <td style={{ padding: "12px" }}>
                      <button
                        onClick={() => toggleStatus(emp.id)}
                        style={{
                          backgroundColor: emp.is_active ? "#8B0000" : "#228B22",
                          color: "#ffffff",
                          border: "none",
                          padding: "6px 12px",
                          borderRadius: "5px",
                          cursor: "pointer",
                        }}
                      >
                        {emp.is_active ? "Deactivate" : "Activate"}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= ACTION BUTTONS ================= */}
      <div style={{ display: "flex", gap: "1rem", marginTop: "2rem", padding: "0 2rem" }}>
        <button
          onClick={() => navigate("/admin/transactions")}
          style={{
            padding: "1rem 2rem",
            fontSize: "1rem",
            cursor: "pointer",
            backgroundColor: "#013220",
            color: "#ffffff",
            border: "none",
            borderRadius: "5px",
            transition: "all 0.25s ease",
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#228B22")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#013220")}
        >
          View All Transactions
        </button>


        <button
    onClick={() => navigate("/admin/audit-logs")}
    style={{
      padding: "1rem 2rem",
      fontSize: "1rem",
      cursor: "pointer",
      backgroundColor: "#013220",
      color: "#ffffff",
      border: "none",
      borderRadius: "5px",
      transition: "all 0.25s ease",
    }}
    onMouseOver={(e) => (e.target.style.backgroundColor = "#228B22")}
    onMouseOut={(e) => (e.target.style.backgroundColor = "#013220")}
  >
    View Audit Logs
  </button>
      </div>
    </div>
  );
}

export default AdminDashboard;