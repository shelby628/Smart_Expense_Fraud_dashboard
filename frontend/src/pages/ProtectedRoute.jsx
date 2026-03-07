import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const navigate = useNavigate();
  const [authorized, setAuthorized] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const verify = async () => {
      try {
        const res = await API.get("transactions/users/me/");

        const user = res.data;

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
        // Cookie is invalid or expired
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
        backgroundColor: "#ffffff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Georgia', serif",
        color: "#aaa",
        fontSize: "0.78rem",
        letterSpacing: "0.3em",
      }}>
        AUTHENTICATING...
      </div>
    );
  }

  return authorized ? children : null;
};

export default ProtectedRoute;