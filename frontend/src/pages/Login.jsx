import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await API.post("token/", { username, password });
      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);

      const meRes = await API.get("transactions/users/me/", {
        headers: { Authorization: `Bearer ${res.data.access}` },
      });
      const userData = meRes.data;

      if (userData.is_admin) {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setError("Invalid username or password.");
      console.log(err.response?.data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "#070a0e",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'Courier New', monospace",
      position: "relative",
      overflow: "hidden",
    }}>

      {/* Background glow */}
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(0,255,128,0.05) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      {/* Grid lines background */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: `
          linear-gradient(rgba(0,255,128,0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0,255,128,0.03) 1px, transparent 1px)
        `,
        backgroundSize: "50px 50px",
        pointerEvents: "none",
      }} />

      {/* Back to home */}
      <button
        onClick={() => navigate("/")}
        style={{
          position: "fixed",
          top: "1.5rem",
          left: "1.5rem",
          backgroundColor: "transparent",
          color: "#444",
          border: "none",
          cursor: "pointer",
          fontSize: "0.8rem",
          letterSpacing: "0.15em",
          fontFamily: "'Courier New', monospace",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          transition: "color 0.2s ease",
          zIndex: 10,
        }}
        onMouseOver={(e) => e.currentTarget.style.color = "#00ff80"}
        onMouseOut={(e) => e.currentTarget.style.color = "#444"}
      >
        ← BACK
      </button>

      {/* Login Card */}
      <div style={{
        position: "relative",
        zIndex: 1,
        width: "100%",
        maxWidth: 420,
        padding: "0 1.5rem",
      }}>

        {/* Logo */}
        <div style={{
          textAlign: "center",
          marginBottom: "2.5rem",
        }}>
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.6rem",
            marginBottom: "1rem",
          }}>
            <div style={{
              width: 8, height: 8,
              backgroundColor: "#00ff80",
              borderRadius: "50%",
              boxShadow: "0 0 12px #00ff80",
            }} />
            <span style={{
              fontSize: "0.9rem",
              letterSpacing: "0.25em",
              color: "#00ff80",
              fontWeight: "bold",
            }}>
              SMARTEXPENSE
            </span>
          </div>
          <h1 style={{
            fontSize: "1.8rem",
            fontWeight: "900",
            fontFamily: "'Georgia', serif",
            color: "#fff",
            marginBottom: "0.5rem",
          }}>
            Welcome back.
          </h1>
          <p style={{ fontSize: "0.8rem", color: "#444", letterSpacing: "0.05em" }}>
            Sign in to access your dashboard
          </p>
        </div>

        {/* Form Card */}
        <div style={{
          backgroundColor: "#0a0d11",
          border: "1px solid #151515",
          borderRadius: "6px",
          padding: "2.5rem",
          boxShadow: "0 40px 80px rgba(0,0,0,0.6)",
        }}>

          {/* Error message */}
          {error && (
            <div style={{
              backgroundColor: "rgba(255,107,107,0.1)",
              border: "1px solid rgba(255,107,107,0.3)",
              borderRadius: "4px",
              padding: "0.75rem 1rem",
              marginBottom: "1.5rem",
              fontSize: "0.8rem",
              color: "#ff6b6b",
              letterSpacing: "0.05em",
            }}>
              ⚠ {error}
            </div>
          )}

          <form onSubmit={handleLogin}>
            {/* Username field */}
            <div style={{ marginBottom: "1.5rem" }}>
              <label style={{
                display: "block",
                fontSize: "0.7rem",
                letterSpacing: "0.2em",
                color: "#555",
                marginBottom: "0.6rem",
              }}>
                USERNAME
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder="Enter your username"
                style={{
                  width: "100%",
                  backgroundColor: "#070a0e",
                  border: "1px solid #1a1a1a",
                  borderRadius: "3px",
                  padding: "0.85rem 1rem",
                  color: "#fff",
                  fontSize: "0.9rem",
                  fontFamily: "'Courier New', monospace",
                  outline: "none",
                  transition: "border-color 0.2s ease",
                  boxSizing: "border-box",
                }}
                onFocus={(e) => e.target.style.borderColor = "#00ff80"}
                onBlur={(e) => e.target.style.borderColor = "#1a1a1a"}
              />
            </div>

            {/* Password field */}
            <div style={{ marginBottom: "2rem" }}>
              <label style={{
                display: "block",
                fontSize: "0.7rem",
                letterSpacing: "0.2em",
                color: "#555",
                marginBottom: "0.6rem",
              }}>
                PASSWORD
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
                style={{
                  width: "100%",
                  backgroundColor: "#070a0e",
                  border: "1px solid #1a1a1a",
                  borderRadius: "3px",
                  padding: "0.85rem 1rem",
                  color: "#fff",
                  fontSize: "0.9rem",
                  fontFamily: "'Courier New', monospace",
                  outline: "none",
                  transition: "border-color 0.2s ease",
                  boxSizing: "border-box",
                }}
                onFocus={(e) => e.target.style.borderColor = "#00ff80"}
                onBlur={(e) => e.target.style.borderColor = "#1a1a1a"}
              />
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                backgroundColor: loading ? "#0a2e1a" : "#00ff80",
                color: loading ? "#00ff80" : "#070a0e",
                border: loading ? "1px solid #00ff80" : "none",
                borderRadius: "3px",
                padding: "0.9rem",
                cursor: loading ? "not-allowed" : "pointer",
                fontSize: "0.85rem",
                fontWeight: "bold",
                letterSpacing: "0.2em",
                fontFamily: "'Courier New', monospace",
                transition: "all 0.2s ease",
                boxShadow: loading ? "none" : "0 0 20px rgba(0,255,128,0.2)",
              }}
              onMouseOver={(e) => {
                if (!loading) e.currentTarget.style.boxShadow = "0 0 40px rgba(0,255,128,0.4)";
              }}
              onMouseOut={(e) => {
                if (!loading) e.currentTarget.style.boxShadow = "0 0 20px rgba(0,255,128,0.2)";
              }}
            >
              {loading ? "AUTHENTICATING..." : "LOGIN →"}
            </button>
          </form>
        </div>

        {/* Footer note */}
        <p style={{
          textAlign: "center",
          marginTop: "2rem",
          fontSize: "0.7rem",
          color: "#2a2a2a",
          letterSpacing: "0.1em",
        }}>
          FRAUD DETECTION SYSTEM © 2025
        </p>
      </div>

      <style>{`
        input::placeholder { color: #2a2a2a; }
        input:-webkit-autofill {
          -webkit-box-shadow: 0 0 0px 1000px #070a0e inset;
          -webkit-text-fill-color: #ffffff;
        }
      `}</style>
    </div>
  );
}

export default Login;