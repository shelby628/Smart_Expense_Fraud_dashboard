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

  const handleLogout = async () => {
    await API.post("token/logout/");
    navigate("/");
  };

  const toggleStatus = async (id) => {
    try {
      const res = await API.post(`transactions/admin/employees/${id}/toggle/`, {});
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
        const statsRes = await API.get("transactions/admin/stats/");
        const empRes = await API.get("transactions/admin/employees/");
        setStats(statsRes.data);
        setEmployees(empRes.data);
      } catch (err) {
        console.log("Error fetching admin data:", err.response?.data || err);
      }
    };
    fetchData();
  }, []);

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
            fontSize: "0.68rem", letterSpacing: "0.2em", color: "#888",
            paddingLeft: "0.75rem", borderLeft: "1px solid #e8e8e8",
          }}>
            ADMIN VIEW
          </span>
        </div>
        <button
          onClick={handleLogout}
          style={{
            backgroundColor: "transparent", color: "#555", border: "none",
            cursor: "pointer", fontSize: "0.78rem", letterSpacing: "0.12em",
            fontFamily: "'Georgia', serif", transition: "color 0.2s ease",
          }}
          onMouseOver={(e) => e.currentTarget.style.color = "#071e07"}
          onMouseOut={(e) => e.currentTarget.style.color = "#555"}
        >
          Log out →
        </button>
      </nav>

      {/* ── MAIN ── */}
      <main style={{ maxWidth: 1140, margin: "0 auto", padding: "4rem 4rem 6rem" }}>

        {/* Header */}
        <div style={{ marginBottom: "3.5rem", paddingBottom: "2.5rem", borderBottom: "1px solid #e8e8e8", textAlign: "center" }}>
          <p style={{ fontSize: "0.68rem", letterSpacing: "0.4em", color: "#071e07", marginBottom: "0.6rem" }}>
            ADMINISTRATION
          </p>
          <h1 style={{
            fontSize: "2.4rem", fontWeight: "900", color: "#0a0a0a",
            lineHeight: 1.1, margin: 0, whiteSpace: "nowrap",
          }}>
            Admin Dashboard
          </h1>
          <p style={{ fontSize: "0.88rem", color: "#555", marginTop: "0.6rem", letterSpacing: "0.02em" }}>
            System overview and employee management
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
            { label: "FLAGGED", value: stats.flagged_transactions, note: "Requires review" },
            { label: "NORMAL", value: stats.normal_transactions, note: "Cleared" },
          ].map((s, i) => (
            <div key={i}
              style={{ backgroundColor: "#fff", padding: "2.5rem 2rem", cursor: "default", transition: "background 0.2s" }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#f9faf9"}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#fff"}
            >
              <p style={{ fontSize: "1.5rem", letterSpacing: "0.28em", color: "#777", marginBottom: "1.2rem" }}>{s.label}</p>
              <p style={{ fontSize: "3rem", fontWeight: "900", color: "#071e07", lineHeight: 1, marginBottom: "0.5rem" }}>{s.value}</p>
              <p style={{ fontSize: "1rem", color: "#666", letterSpacing: "0.05em" }}>{s.note}</p>
            </div>
          ))}
        </div>

        {/* ── QUICK ACTIONS ── */}
        <div style={{ marginBottom: "4rem" }}>
          <p style={{ fontSize: "1rem", letterSpacing: "0.4em", color: "#071e07", marginBottom: "0.4rem" }}>MANAGE</p>
          <h2 style={{ fontSize: "1.8rem", fontWeight: "900", color: "#0a0a0a", marginBottom: "1.5rem" }}>
            Actions
          </h2>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <button
              onClick={() => navigate("/admin/transactions")}
              style={{
                backgroundColor: "#071e07", color: "#fff", border: "none",
                borderRadius: "3px", padding: "0.85rem 2rem", cursor: "pointer",
                fontSize: "0.8rem", letterSpacing: "0.12em", fontFamily: "'Georgia', serif",
                transition: "background 0.2s ease",
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#0f3a0f"}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#071e07"}
            >
              All Transactions →
            </button>
            <button
              onClick={() => navigate("/admin/audit-logs")}
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
              Audit Logs →
            </button>
          </div>
        </div>

        {/* ── EMPLOYEE TABLE ── */}
        <div>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: "1.5rem" }}>
            <div>
              <p style={{ fontSize: "1rem", letterSpacing: "0.4em", color: "#071e07", marginBottom: "0.4rem" }}>PERSONNEL</p>
              <h2 style={{ fontSize: "1.7rem", fontWeight: "900", color: "#0a0a0a", margin: 0 }}>Employee Management</h2>
            </div>
            <span style={{ fontSize: "0.78rem", color: "#666", letterSpacing: "0.05em" }}>
              {employees.length} {employees.length === 1 ? "employee" : "employees"}
            </span>
          </div>

          <div style={{ border: "1px solid #e8e8e8", borderRadius: "4px", overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "'Georgia', serif" }}>
              <thead>
                <tr style={{ backgroundColor: "#fafafa", borderBottom: "1px solid #e8e8e8" }}>
                  {["USERNAME", "EMAIL", "STATUS", "ACTION"].map((col) => (
                    <th key={col} style={{
                      padding: "0.9rem 1.5rem", textAlign: "left",
                      fontSize: "0.83rem", letterSpacing: "0.25em",
                      color: "#061c1a", fontWeight: "normal",
                    }}>
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {employees.length === 0 ? (
                  <tr>
                    <td colSpan="4" style={{ padding: "3rem", textAlign: "center", color: "#888", fontSize: "0.85rem" }}>
                      No employees found.
                    </td>
                  </tr>
                ) : (
                  employees.map((emp, i) => (
                    <tr key={emp.id} style={{
                      borderBottom: i < employees.length - 1 ? "1px solid #f0f0f0" : "none",
                      transition: "background 0.15s",
                    }}
                      onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#fafafa"}
                      onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#fff"}
                    >
                      <td style={{ padding: "1.1rem 1.5rem", fontSize: "0.88rem", color: "#0a0a0a", fontWeight: "bold" }}>
                        {emp.username}
                      </td>
                      <td style={{ padding: "1.1rem 1.5rem", fontSize: "0.82rem", color: "#555" }}>
                        {emp.email}
                      </td>
                      <td style={{ padding: "1.1rem 1.5rem" }}>
                        <span style={{
                          display: "inline-flex", alignItems: "center", gap: "0.4rem",
                          fontSize: "0.65rem", letterSpacing: "0.18em", fontWeight: "bold",
                          color: emp.is_active ? "#071e07" : "#888",
                        }}>
                          <span style={{
                            width: 6, height: 6, borderRadius: "50%",
                            backgroundColor: emp.is_active ? "#071e07" : "#ddd",
                            display: "inline-block",
                          }} />
                          {emp.is_active ? "ACTIVE" : "INACTIVE"}
                        </span>
                      </td>
                      <td style={{ padding: "1.1rem 1.5rem" }}>
                        <button
                          onClick={() => toggleStatus(emp.id)}
                          style={{
                            backgroundColor: "transparent",
                            color: emp.is_active ? "#cc0000" : "#071e07",
                            border: `1px solid ${emp.is_active ? "#f5cccc" : "#d8d8d8"}`,
                            borderRadius: "3px", padding: "0.35rem 0.9rem",
                            cursor: "pointer", fontSize: "0.7rem",
                            letterSpacing: "0.1em", fontFamily: "'Georgia', serif",
                            transition: "all 0.2s ease",
                          }}
                          onMouseOver={(e) => e.currentTarget.style.backgroundColor = emp.is_active ? "#fff5f5" : "#f7faf7"}
                          onMouseOut={(e) => e.currentTarget.style.backgroundColor = "transparent"}
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
        <span style={{ fontSize: "0.68rem", color: "#888", letterSpacing: "0.1em" }}>FRAUD DETECTION SYSTEM © 2026</span>
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

export default AdminDashboard;