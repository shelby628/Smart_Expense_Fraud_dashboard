import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [slowMessage, setSlowMessage] = useState(false);
  const navigate = useNavigate();
  const slowTimer = useRef(null);

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError("");
    setSlowMessage(false);

    slowTimer.current = setTimeout(() => setSlowMessage(true), 5000);

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
      if (!err.response) {
        setError("Server is waking up. Please try again in a moment.");
      } else {
        setError("Invalid username or password.");
      }
      console.log(err.response?.data);
    } finally {
      clearTimeout(slowTimer.current);
      setSlowMessage(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    return () => clearTimeout(slowTimer.current);
  }, []);

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "#ffffff",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'Georgia', serif",
      position: "relative",
    }}>

      {/* Back to home */}
      <button
        onClick={() => navigate("/")}
        style={{
          position: "fixed",
          top: "1.5rem",
          left: "1.5rem",
          backgroundColor: "transparent",
          color: "#aaa",
          border: "none",
          cursor: "pointer",
          fontSize: "0.82rem",
          letterSpacing: "0.1em",
          fontFamily: "'Georgia', serif",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          transition: "color 0.2s ease",
          zIndex: 10,
        }}
        onMouseOver={(e) => e.currentTarget.style.color = "#071e07"}
        onMouseOut={(e) => e.currentTarget.style.color = "#aaa"}
      >
        ← Back
      </button>

      {/* Login Card */}
      <div style={{
        width: "100%",
        maxWidth: 420,
        padding: "0 1.5rem",
      }}>

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            marginBottom: "1.2rem",
          }}>
            <div style={{
              width: 9, height: 9,
              backgroundColor: "#071e07",
              borderRadius: "50%",
            }} />
            <span style={{
              fontSize: "0.9rem",
              letterSpacing: "0.2em",
              color: "#071e07",
              fontWeight: "bold",
              fontFamily: "'Georgia', serif",
            }}>
              SMARTEXPENSE
            </span>
          </div>
          <h1 style={{
            fontSize: "1.8rem",
            fontWeight: "900",
            color: "#0a0a0a",
            marginBottom: "0.5rem",
          }}>
            Welcome back.
          </h1>
          <p style={{
            fontSize: "0.85rem",
            color: "#999",
            letterSpacing: "0.03em",
          }}>
            Sign in to access your dashboard
          </p>
        </div>

        {/* Form Card */}
        <div style={{
          backgroundColor: "#ffffff",
          border: "1px solid #e8e8e8",
          borderRadius: "6px",
          padding: "2.5rem",
          boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
        }}>

          {/* Slow wake-up message */}
          {slowMessage && (
            <div style={{
              backgroundColor: "#f7faf7",
              border: "1px solid #071e07",
              borderRadius: "4px",
              padding: "0.75rem 1rem",
              marginBottom: "1.5rem",
              fontSize: "0.8rem",
              color: "#071e07",
              letterSpacing: "0.03em",
            }}>
              ⏳ Server is waking up, please wait...
            </div>
          )}

          {/* Error message */}
          {error && (
            <div style={{
              backgroundColor: "#fff5f5",
              border: "1px solid #ffcccc",
              borderRadius: "4px",
              padding: "0.75rem 1rem",
              marginBottom: "1.5rem",
              fontSize: "0.8rem",
              color: "#cc0000",
              letterSpacing: "0.03em",
            }}>
              ⚠ {error}
              {error.includes("waking up") && (
                <button
                  onClick={handleLogin}
                  style={{
                    display: "block",
                    marginTop: "0.6rem",
                    backgroundColor: "transparent",
                    border: "1px solid #cc0000",
                    borderRadius: "3px",
                    color: "#cc0000",
                    padding: "0.4rem 0.8rem",
                    cursor: "pointer",
                    fontSize: "0.75rem",
                    fontFamily: "'Georgia', serif",
                    letterSpacing: "0.05em",
                  }}
                >
                  Retry →
                </button>
              )}
            </div>
          )}

          <form onSubmit={handleLogin}>
            {/* Username field */}
            <div style={{ marginBottom: "1.5rem" }}>
              <label style={{
                display: "block",
                fontSize: "0.72rem",
                letterSpacing: "0.2em",
                color: "#888",
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
                  backgroundColor: "#fafafa",
                  border: "1px solid #e8e8e8",
                  borderRadius: "3px",
                  padding: "0.85rem 1rem",
                  color: "#0a0a0a",
                  fontSize: "0.9rem",
                  fontFamily: "'Georgia', serif",
                  outline: "none",
                  transition: "border-color 0.2s ease",
                  boxSizing: "border-box",
                }}
                onFocus={(e) => e.target.style.borderColor = "#071e07"}
                onBlur={(e) => e.target.style.borderColor = "#e8e8e8"}
              />
            </div>

            {/* Password field */}
            <div style={{ marginBottom: "2rem" }}>
              <label style={{
                display: "block",
                fontSize: "0.72rem",
                letterSpacing: "0.2em",
                color: "#888",
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
                  backgroundColor: "#fafafa",
                  border: "1px solid #e8e8e8",
                  borderRadius: "3px",
                  padding: "0.85rem 1rem",
                  color: "#0a0a0a",
                  fontSize: "0.9rem",
                  fontFamily: "'Georgia', serif",
                  outline: "none",
                  transition: "border-color 0.2s ease",
                  boxSizing: "border-box",
                }}
                onFocus={(e) => e.target.style.borderColor = "#071e07"}
                onBlur={(e) => e.target.style.borderColor = "#e8e8e8"}
              />
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                backgroundColor: loading ? "#f0f0f0" : "#071e07",
                color: loading ? "#999" : "#ffffff",
                border: "none",
                borderRadius: "3px",
                padding: "0.9rem",
                cursor: loading ? "not-allowed" : "pointer",
                fontSize: "0.85rem",
                fontWeight: "bold",
                letterSpacing: "0.15em",
                fontFamily: "'Georgia', serif",
                transition: "all 0.2s ease",
              }}
              onMouseOver={(e) => {
                if (!loading) e.currentTarget.style.backgroundColor = "#0f3a0f";
              }}
              onMouseOut={(e) => {
                if (!loading) e.currentTarget.style.backgroundColor = "#071e07";
              }}
            >
              {loading ? "Authenticating..." : "Login →"}
            </button>
          </form>
        </div>

        {/* Footer note */}
        <p style={{
          textAlign: "center",
          marginTop: "2rem",
          fontSize: "0.72rem",
          color: "#ccc",
          letterSpacing: "0.1em",
        }}>
          FRAUD DETECTION SYSTEM © 2025
        </p>
      </div>

      <style>{`
        input::placeholder { color: #ccc; }
        input:-webkit-autofill {
          -webkit-box-shadow: 0 0 0px 1000px #fafafa inset;
          -webkit-text-fill-color: #0a0a0a;
        }
      `}</style>
    </div>
  );
}

export default Login;