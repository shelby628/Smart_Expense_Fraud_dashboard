import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

function Upload() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setMessage("Please select a CSV file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await API.post("transactions/upload/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setMessage(
        `Upload complete! Created: ${res.data.created}, Flagged: ${res.data.flagged}`
      );

      setFile(null); // reset file input
    } catch (err) {
      setMessage("Error uploading CSV.");
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
        <span style={{ fontWeight: "bold", fontSize: "1.2rem" }}>Upload Transactions CSV</span>
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
            maxWidth: "500px",
            margin: "0 auto",
            color: "#ffffff",
          }}
        >
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <label>
              Select CSV File:
              <input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
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
              Upload
            </button>
          </form>

          {message && <p style={{ whiteSpace: "pre-line", marginTop: "1rem" }}>{message}</p>}
        </div>
      </div>
    </div>
  );
}

export default Upload;