import React, { useEffect, useState } from "react";
import api from "../api";
import { color } from "framer-motion";

export default function ManageEmployees() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);
  const [email, setEmail] = useState("");

  const fetchEmployees = async () => {
    try {
      const res = await api.get("/transactions/employees/");
      setEmployees(res.data);
    } catch (err) {
      console.error("Failed to fetch employees:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const toggleStatus = async (id) => {
    try {
      await api.post(`/transactions/employees/${id}/toggle/`);
      fetchEmployees(); // refresh list
    } catch (err) {
      console.error("Failed to toggle status:", err);
      alert("Failed to change employee status");
    }
  };
  
  const saveEdit = async () => {
    try {
      await api.patch(`/transactions/employees/${editingUser.id}/update/`, {
        email: email,
      });
      setEditingUser(null);
      fetchEmployees();
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("Failed to update employee");
    }
  };

  if (loading) return <p>Loading employees...</p>;

  return (
    <div className="glass-card">
      <h2 style={styles.header}>Manage Employees</h2>

      <table style={styles.table}>
        <thead>
          <tr style={styles.theadRow}>
            <th style={styles.th}>Username</th>
            <th style={styles.th}>Email</th>
            <th style={styles.th}>Status</th>
            <th style={styles.th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp) => (
            <tr key={emp.id} style={styles.row}>
              <td style={styles.td}>{emp.username}</td>
              <td style={styles.td}>{emp.email}</td>
              <td style={styles.td}>
                {emp.is_active ? "Active" : "Inactive"}
              </td>
              <td style={styles.td}>
                <button
                  style={styles.editBtn}
                  onClick={() => {
                    setEditingUser(emp);
                    setEmail(emp.email);
                  }}
                >
                  Edit
                </button>

                <button
                  style={{
                    ...styles.toggleBtn,
                    background: emp.is_active ? "#dc2626" : "#16a34a",
                  }}
                  onClick={() => toggleStatus(emp.id)}
                >
                  {emp.is_active ? "Deactivate" : "Reactivate"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Edit Modal */}
      {editingUser && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h3>Edit Employee Email</h3>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
            />
            <div style={{ marginTop: "1rem" }}>
              <button style={styles.saveBtn} onClick={saveEdit}>
                Save
              </button>
              <button
                style={styles.cancelBtn}
                onClick={() => setEditingUser(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ------------------ Styles ------------------ */
const styles = {
  header: {
    background: "#16a34a",
    color: "white",
    padding: "1rem",
    borderRadius: "12px",
    marginBottom: "1rem",
    textAlign: "center",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  theadRow: {
    background: "rgba(255,255,255,0.05)",
  },
  th: {
    textAlign: "left",
    padding: "1rem",
    color: "#9ca3af",
  },
  td: {
    padding: "1rem",
    verticalAlign: "middle",
  },
  row: {
    borderBottom: "1px solid rgba(255,255,255,0.08)",
  },
  editBtn: {
    padding: "6px 12px",
    borderRadius: "6px",
    background: "#2563eb",
    color: "white",
    border: "none",
    cursor: "pointer",
    marginRight: "8px",
  },
  toggleBtn: {
    padding: "6px 12px",
    borderRadius: "6px",
    color: "white",
    border: "none",
    cursor: "pointer",
  },
  modalOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.6)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    background: "#111217",
    padding: "2rem",
    borderRadius: "12px",
    width: "320px",
    color: "white",
  },
  input: {
    width: "100%",
    padding: "10px",
    borderRadius: "6px",
    border: "none",
    marginTop: "8px",
  },
  saveBtn: {
    background: "#16a34a",
    color: "white",
    padding: "8px 14px",
    borderRadius: "6px",
    border: "none",
    marginRight: "10px",
    cursor: "pointer",
  },
  cancelBtn: {
    background: "#374151",
    color: "white",
    padding: "8px 14px",
    borderRadius: "6px",
    border: "none",
    cursor: "pointer",
  },
};