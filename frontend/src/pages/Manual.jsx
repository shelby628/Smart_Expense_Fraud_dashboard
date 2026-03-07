import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

function Manual() {
  const navigate = useNavigate();
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("KES");
  const [transactionType, setTransactionType] = useState("expense");
  const [description, setDescription] = useState("");
  const [merchant, setMerchant] = useState("");
  const [transactionDate, setTransactionDate] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const formattedDate = transactionDate ? transactionDate.split("T")[0] : "";
      const res = await API.post("transactions/manual/", {
        amount,
        currency,
        transaction_type: transactionType,
        description,
        merchant,
        transaction_date: formattedDate,
      });

      const txIdShort = res.data.transaction_id.slice(0, 8);
      let msg = `Success! Transaction ID: ${txIdShort}`;

      if (res.data.is_flagged || res.data.ml_flag) {
        msg += `\n⚠️ This transaction has been flagged! Reason: ${res.data.flag_reason || "ML/Rules"}`;
      }

      setMessage(msg);

      setAmount("");
      setCurrency("KES");
      setTransactionType("expense");
      setDescription("");
      setMerchant("");
      setTransactionDate("");
    } catch (err) {
      setMessage("Error submitting transaction.");
      console.log(err.response?.data);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "0.6rem 0.75rem",
    borderRadius: "3px",
    border: "1px solid #d8d8d8",
    marginTop: "0.35rem",
    fontFamily: "'Georgia', serif",
    fontSize: "0.88rem",
    color: "#0a0a0a",
    outline: "none",
    boxSizing: "border-box",
  };

  const labelStyle = {
    fontSize: "0.75rem",
    letterSpacing: "0.2em",
    color: "#071e07",
    display: "block",
    marginBottom: "0.1rem",
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
            fontSize: "0.68rem", letterSpacing: "0.2em", color: "#888",
            paddingLeft: "0.75rem", borderLeft: "1px solid #e8e8e8",
          }}>
            MANUAL ENTRY
          </span>
        </div>
        <button
          onClick={() => navigate("/dashboard")}
          style={{
            backgroundColor: "transparent", color: "#555", border: "none",
            cursor: "pointer", fontSize: "0.78rem", letterSpacing: "0.12em",
            fontFamily: "'Georgia', serif", transition: "color 0.2s ease",
          }}
          onMouseOver={(e) => e.currentTarget.style.color = "#071e07"}
          onMouseOut={(e) => e.currentTarget.style.color = "#555"}
        >
          ← Back
        </button>
      </nav>

      {/* ── MAIN ── */}
      <main style={{ maxWidth: 1140, margin: "0 auto", padding: "4rem 4rem 6rem" }}>

        {/* Header */}
        <div style={{ marginBottom: "3.5rem", paddingBottom: "2.5rem", borderBottom: "1px solid #e8e8e8" }}>
          <p style={{ fontSize: "0.68rem", letterSpacing: "0.4em", color: "#071e07", marginBottom: "0.6rem" }}>
            SUBMIT
          </p>
          <h1 style={{ fontSize: "2.4rem", fontWeight: "900", color: "#0a0a0a", lineHeight: 1.1, margin: 0 }}>
            Manual Transaction
          </h1>
          <p style={{ fontSize: "0.88rem", color: "#555", marginTop: "0.6rem", letterSpacing: "0.02em" }}>
            Enter transaction details below to submit for review
          </p>
        </div>

        {/* ── FORM ── */}
        <div style={{ maxWidth: 600 }}>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

            <div>
              <label style={labelStyle}>AMOUNT</label>
              <input
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>CURRENCY</label>
              <input
                type="text"
                value={currency}
                onChange={(e) => setCurrency(e.target.value.toUpperCase())}
                required
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>TRANSACTION TYPE</label>
              <select
                value={transactionType}
                onChange={(e) => setTransactionType(e.target.value)}
                style={inputStyle}
              >
                <option value="expense">Expense</option>
                <option value="sale">Sale</option>
                <option value="refund">Refund</option>
              </select>
            </div>

            <div>
              <label style={labelStyle}>DESCRIPTION</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>MERCHANT</label>
              <input
                type="text"
                value={merchant}
                onChange={(e) => setMerchant(e.target.value)}
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>TRANSACTION DATE</label>
              <input
                type="datetime-local"
                value={transactionDate}
                onChange={(e) => setTransactionDate(e.target.value)}
                required
                style={inputStyle}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                backgroundColor: loading ? "#0f3a0f" : "#071e07",
                color: "#fff",
                border: "none",
                borderRadius: "3px",
                padding: "0.85rem 2rem",
                cursor: loading ? "not-allowed" : "pointer",
                fontSize: "0.8rem",
                letterSpacing: "0.12em",
                fontFamily: "'Georgia', serif",
                transition: "background 0.2s ease",
                alignSelf: "flex-start",
              }}
              onMouseOver={(e) => { if (!loading) e.currentTarget.style.backgroundColor = "#0f3a0f"; }}
              onMouseOut={(e) => { if (!loading) e.currentTarget.style.backgroundColor = "#071e07"; }}
            >
              {loading ? "Submitting..." : "Submit Transaction →"}
            </button>
          </form>

          {message && (
            <p style={{
              whiteSpace: "pre-line",
              marginTop: "1.5rem",
              backgroundColor: message.startsWith("Success") ? "#f4faf4" : "#fff5f5",
              border: message.startsWith("Success") ? "1px solid #c3e6cb" : "1px solid #f5cccc",
              borderRadius: "3px",
              padding: "1rem 1.25rem",
              color: message.startsWith("Success") ? "#071e07" : "#cc0000",
              fontSize: "0.85rem",
              letterSpacing: "0.02em",
              fontFamily: "'Georgia', serif",
            }}>
              {message}
            </p>
          )}
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
        input:focus, select:focus { border-color: #071e07 !important; }
        @media (max-width: 768px) {
          nav, footer { padding-left: 1.5rem !important; padding-right: 1.5rem !important; }
          main { padding: 2rem 1.5rem 4rem !important; }
        }
      `}</style>
    </div>
  );
}

export default Manual;