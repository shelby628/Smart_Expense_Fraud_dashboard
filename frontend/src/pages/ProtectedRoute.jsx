import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const navigate = useNavigate();
  const [authorized, setAuthorized] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const verify = async () => {
      const token = localStorage.getItem("access");

      // No token at all → redirect to landing page
      if (!token) {
        navigate("/");
        return;
      }

      try {
        const res = await API.get("transactions/users/me/", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const user = res.data;

        // Admin trying to access employee route or vice versa
        if (adminOnly && !user.is_admin) {
          navigate("/");
          return;
        }

        if (!adminOnly && user.is_admin) {
          navigate("/admin");
          return;
        }

        setAuthorized(true);
      } catch (err) {
        // Token is invalid or expired
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        navigate("/");
      } finally {
        setChecking(false);
      }
    };

    verify();
  }, []);

  if (checking) {
    return (
      <div style={{
        minHeight: "100vh",
        backgroundColor: "#070a0e",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Courier New', monospace",
        color: "#00ff80",
        fontSize: "0.85rem",
        letterSpacing: "0.2em",
      }}>
        AUTHENTICATING...
      </div>
    );
  }

  return authorized ? children : null;
};

export default ProtectedRoute;