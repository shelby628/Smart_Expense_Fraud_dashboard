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

  const handleSubmit = async (e) => {
    e.preventDefault();

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

      // Reset form
      setAmount("");
      setCurrency("KES");
      setTransactionType("expense");
      setDescription("");
      setMerchant("");
      setTransactionDate("");
    } catch (err) {
      setMessage("Error submitting transaction.");
      console.log(err.response?.data);
    }
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#ffffff" }}>
      {/* Navbar */}
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
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
        }}
      >
        <span style={{ fontWeight: "bold", fontSize: "1.2rem" }}>Manual Transaction</span>
        <button
          onClick={() => navigate("/dashboard")}
          style={{
            backgroundColor: "#ffffff",
            color: "#013220",
            border: "none",
            borderRadius: "5px",
            padding: "0.5rem 1rem",
            cursor: "pointer",
            fontWeight: "bold",
            transition: "all 0.2s ease"
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#e6e6e6")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#ffffff")}
        >
          ← Back
        </button>
      </div>

      {/* Form Section */}
      <div style={{ padding: "2rem" }}>
        <div
          style={{
            backgroundColor: "#0a4d1b",
            padding: "2rem",
            borderRadius: "8px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
            maxWidth: "600px",
            margin: "0 auto",
            color: "#ffffff",
          }}
        >
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <label>
              Amount:
              <input
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  borderRadius: "5px",
                  border: "none",
                  marginTop: "0.25rem"
                }}
              />
            </label>

            <label>
              Currency:
              <input
                type="text"
                value={currency}
                onChange={(e) => setCurrency(e.target.value.toUpperCase())}
                required
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  borderRadius: "5px",
                  border: "none",
                  marginTop: "0.25rem"
                }}
              />
            </label>

            <label>
              Transaction Type:
              <select
                value={transactionType}
                onChange={(e) => setTransactionType(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  borderRadius: "5px",
                  border: "none",
                  marginTop: "0.25rem"
                }}
              >
                <option value="expense">Expense</option>
                <option value="sale">Sale</option>
                <option value="refund">Refund</option>
              </select>
            </label>

            <label>
              Description:
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  borderRadius: "5px",
                  border: "none",
                  marginTop: "0.25rem"
                }}
              />
            </label>

            <label>
              Merchant:
              <input
                type="text"
                value={merchant}
                onChange={(e) => setMerchant(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  borderRadius: "5px",
                  border: "none",
                  marginTop: "0.25rem"
                }}
              />
            </label>

            <label>
              Transaction Date:
              <input
                type="datetime-local"
                value={transactionDate}
                onChange={(e) => setTransactionDate(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  borderRadius: "5px",
                  border: "none",
                  marginTop: "0.25rem"
                }}
              />
            </label>

            <button
              type="submit"
              style={{
                backgroundColor: "#013220",
                color: "#ffffff",
                padding: "0.75rem",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                fontWeight: "bold",
                transition: "all 0.2s ease"
              }}
              onMouseOver={(e) => (e.target.style.backgroundColor = "#228B22")}
              onMouseOut={(e) => (e.target.style.backgroundColor = "#013220")}
            >
              Submit Transaction
            </button>
          </form>

          {message && <p style={{ whiteSpace: "pre-line", marginTop: "1rem" }}>{message}</p>}
        </div>
      </div>
    </div>
  );
}

export default Manual;