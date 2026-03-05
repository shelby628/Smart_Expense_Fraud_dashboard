import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = Array.from({ length: 80 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      size: Math.random() * 1.5 + 0.5,
      opacity: Math.random() * 0.5 + 0.1,
    }));

    let animId;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 255, 128, ${p.opacity})`;
        ctx.fill();
      });
      particles.forEach((p1, i) => {
        particles.slice(i + 1).forEach((p2) => {
          const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(0, 255, 128, ${0.08 * (1 - dist / 100)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });
      animId = requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const handleMouse = (e) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", handleMouse);
    return () => window.removeEventListener("mousemove", handleMouse);
  }, []);

  const features = [
    {
      icon: "⬡",
      title: "ML-Powered Detection",
      desc: "Random Forest model analyzes behavioral patterns, amount deviations, and transaction timing to predict fraud probability in real time.",
      accent: "#00ff80",
    },
    {
      icon: "◈",
      title: "Rule-Based Engine",
      desc: "Hardcoded fraud rules catch blacklisted vendors, duplicate transactions, and threshold violations instantly.",
      accent: "#00cfff",
    },
    {
      icon: "◉",
      title: "Combined Risk Score",
      desc: "ML score (70%) and rule score (30%) merge into one final verdict. No signal goes unheard. No transaction slips through.",
      accent: "#ff6b6b",
    },
    {
      icon: "⬟",
      title: "Admin Review System",
      desc: "Flagged transactions queue for admin approval or blocking. Every action is logged with a full audit trail.",
      accent: "#ffd93d",
    },
  ];

  const steps = [
    { number: "01", title: "Employee Submits", desc: "Manual entry or CSV upload — transactions enter the system instantly." },
    { number: "02", title: "AI Scores It", desc: "ML model and fraud rules run in parallel, combining into a final risk score." },
    { number: "03", title: "Admin Reviews", desc: "Flagged transactions appear for review. Approve or block with one click." },
  ];

  const stats = [
    { value: "459+", label: "Transactions Analyzed" },
    { value: "70%", label: "ML Model Weight" },
    { value: "< 1s", label: "Scoring Time" },
    { value: "100%", label: "Audit Coverage" },
  ];

  return (
    <div style={{
      backgroundColor: "#070a0e",
      color: "#e8eaf0",
      fontFamily: "'Courier New', monospace",
      overflowX: "hidden",
      cursor: "none",
    }}>

      {/* Custom cursor */}
      <div style={{
        position: "fixed",
        left: mousePos.x - 6,
        top: mousePos.y - 6,
        width: 12,
        height: 12,
        backgroundColor: "#00ff80",
        borderRadius: "50%",
        pointerEvents: "none",
        zIndex: 9999,
        mixBlendMode: "screen",
      }} />
      <div style={{
        position: "fixed",
        left: mousePos.x - 20,
        top: mousePos.y - 20,
        width: 40,
        height: 40,
        border: "1px solid rgba(0,255,128,0.3)",
        borderRadius: "50%",
        pointerEvents: "none",
        zIndex: 9998,
        transition: "left 0.15s ease, top 0.15s ease",
      }} />

      {/* ── HERO ── */}
      <section style={{
        position: "relative",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
      }}>
        <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, zIndex: 0 }} />
        <div style={{
          position: "absolute", inset: 0, zIndex: 1,
          background: "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(0,255,128,0.07) 0%, transparent 70%)",
        }} />

        {/* Navbar */}
        <nav style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "1.2rem 3rem",
          borderBottom: "1px solid rgba(0,255,128,0.1)",
          backgroundColor: "rgba(7,10,14,0.85)",
          backdropFilter: "blur(12px)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <div style={{
              width: 8, height: 8,
              backgroundColor: "#00ff80",
              borderRadius: "50%",
              boxShadow: "0 0 8px #00ff80",
            }} />
            <span style={{ fontSize: "0.95rem", letterSpacing: "0.2em", color: "#00ff80", fontWeight: "bold" }}>
              SMARTEXPENSE
            </span>
          </div>
          <button
            onClick={() => navigate("/login")}
            style={{
              backgroundColor: "transparent",
              color: "#00ff80",
              border: "1px solid #00ff80",
              borderRadius: "2px",
              padding: "0.5rem 1.5rem",
              cursor: "none",
              fontSize: "0.8rem",
              letterSpacing: "0.15em",
              transition: "all 0.2s ease",
              fontFamily: "'Courier New', monospace",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = "#00ff80";
              e.currentTarget.style.color = "#070a0e";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = "#00ff80";
            }}
          >
            LOGIN →
          </button>
        </nav>

        {/* Hero Content */}
        <div style={{
          position: "relative", zIndex: 2,
          textAlign: "center", padding: "0 2rem", maxWidth: 900,
        }}>
          <div style={{
            display: "inline-block",
            fontSize: "0.7rem",
            letterSpacing: "0.4em",
            color: "#00ff80",
            border: "1px solid rgba(0,255,128,0.3)",
            padding: "0.4rem 1.2rem",
            marginBottom: "2rem",
          }}>
           FRAUD DETECTION
          </div>

          <h1 style={{
            fontSize: "clamp(2.5rem, 7vw, 5.5rem)",
            fontWeight: "900",
            lineHeight: 1.05,
            marginBottom: "1.5rem",
            fontFamily: "'Georgia', serif",
          }}>
            <span style={{ color: "#ffffff" }}>Every transaction</span>
            <br />
            <span style={{
              background: "linear-gradient(90deg, #00ff80, #00cfff)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>
              tells a story.
            </span>
            <br />
            <span style={{ color: "#ffffff" }}>We read between</span>
            <br />
            <span style={{ color: "#444" }}>the lines.</span>
          </h1>

          <p style={{
            fontSize: "1rem",
            color: "#888",
            maxWidth: 500,
            margin: "0 auto 3rem",
            lineHeight: 1.8,
            letterSpacing: "0.02em",
          }}>
            Combining rule-based logic and machine learning  to detect fraud before it costs you.
          </p>

          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <button
              onClick={() => navigate("/login")}
              style={{
                backgroundColor: "#00ff80",
                color: "#070a0e",
                border: "none",
                borderRadius: "2px",
                padding: "0.9rem 2.5rem",
                cursor: "none",
                fontSize: "0.85rem",
                fontWeight: "bold",
                letterSpacing: "0.15em",
                fontFamily: "'Courier New', monospace",
                boxShadow: "0 0 30px rgba(0,255,128,0.3)",
                transition: "all 0.2s ease",
              }}
              onMouseOver={(e) => e.currentTarget.style.boxShadow = "0 0 50px rgba(0,255,128,0.6)"}
              onMouseOut={(e) => e.currentTarget.style.boxShadow = "0 0 30px rgba(0,255,128,0.3)"}
            >
              GET STARTED →
            </button>
            <button
              onClick={() => document.getElementById("how").scrollIntoView({ behavior: "smooth" })}
              style={{
                backgroundColor: "transparent",
                color: "#888",
                border: "1px solid #333",
                borderRadius: "2px",
                padding: "0.9rem 2.5rem",
                cursor: "none",
                fontSize: "0.85rem",
                letterSpacing: "0.15em",
                fontFamily: "'Courier New', monospace",
                transition: "all 0.2s ease",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.borderColor = "#555";
                e.currentTarget.style.color = "#ccc";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.borderColor = "#333";
                e.currentTarget.style.color = "#888";
              }}
            >
              SEE HOW IT WORKS
            </button>
          </div>
        </div>

        
      </section>

      {/* ── STATS ── */}
      <section style={{
        padding: "4rem 3rem",
        borderTop: "1px solid #111",
        borderBottom: "1px solid #111",
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: "2rem",
        maxWidth: 1100,
        margin: "0 auto",
      }}>
        {stats.map((s, i) => (
          <div key={i} style={{ textAlign: "center" }}>
            <div style={{
              fontSize: "clamp(1.8rem, 4vw, 3rem)",
              fontWeight: "900",
              fontFamily: "'Georgia', serif",
              background: "linear-gradient(135deg, #00ff80, #00cfff)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              marginBottom: "0.5rem",
            }}>
              {s.value}
            </div>
            <div style={{ fontSize: "0.7rem", letterSpacing: "0.2em", color: "#555" }}>
              {s.label}
            </div>
          </div>
        ))}
      </section>

      {/* ── FEATURES ── */}
      <section style={{ padding: "7rem 3rem", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ marginBottom: "4rem" }}>
          <div style={{ fontSize: "0.7rem", letterSpacing: "0.4em", color: "#00ff80", marginBottom: "1rem" }}>
            CAPABILITIES
          </div>
          <h2 style={{
            fontSize: "clamp(1.8rem, 4vw, 3rem)",
            fontFamily: "'Georgia', serif",
            fontWeight: "900",
            color: "#fff",
            maxWidth: 500,
            lineHeight: 1.2,
          }}>
            Built different.<br />
            <span style={{ color: "#333" }}>Designed to catch what others miss.</span>
          </h2>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "1.5rem",
        }}>
          {features.map((f, i) => (
            <div
              key={i}
              style={{
                border: "1px solid #151515",
                borderRadius: "4px",
                padding: "2rem",
                backgroundColor: "#0a0d11",
                transition: "all 0.3s ease",
                position: "relative",
                overflow: "hidden",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.borderColor = f.accent;
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "0 20px 40px rgba(0,0,0,0.4)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.borderColor = "#151515";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <div style={{ fontSize: "2rem", color: f.accent, marginBottom: "1rem" }}>{f.icon}</div>
              <h3 style={{
                fontSize: "1rem", fontWeight: "bold",
                color: "#fff", marginBottom: "0.75rem", letterSpacing: "0.05em",
              }}>
                {f.title}
              </h3>
              <p style={{ fontSize: "0.82rem", color: "#555", lineHeight: 1.8 }}>{f.desc}</p>
              <div style={{
                position: "absolute", bottom: 0, left: 0, right: 0,
                height: 2, backgroundColor: f.accent, opacity: 0.3,
              }} />
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how" style={{
        padding: "7rem 3rem",
        borderTop: "1px solid #111",
        backgroundColor: "#050709",
      }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ marginBottom: "4rem", textAlign: "center" }}>
            <div style={{ fontSize: "0.7rem", letterSpacing: "0.4em", color: "#00ff80", marginBottom: "1rem" }}>
              HOW IT WORKS
            </div>
            <h2 style={{
              fontSize: "clamp(1.8rem, 4vw, 3rem)",
              fontFamily: "'Georgia', serif",
              fontWeight: "900",
              color: "#fff",
            }}>
              Three steps. Zero tolerance.
            </h2>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "3rem",
          }}>
            {steps.map((s, i) => (
              <div key={i} style={{ position: "relative" }}>
                <div style={{
                  fontSize: "4rem",
                  fontWeight: "900",
                  fontFamily: "'Georgia', serif",
                  color: "#111",
                  lineHeight: 1,
                  marginBottom: "1rem",
                  position: "relative",
                }}>
                  {s.number}
                  <div style={{
                    position: "absolute",
                    top: "50%", left: 0,
                    width: "2rem", height: 2,
                    backgroundColor: "#00ff80",
                    transform: "translateY(-50%)",
                  }} />
                </div>
                <h3 style={{
                  fontSize: "1.1rem", fontWeight: "bold",
                  color: "#fff", marginBottom: "0.75rem",
                }}>
                  {s.title}
                </h3>
                <p style={{ fontSize: "0.85rem", color: "#555", lineHeight: 1.8 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{
        padding: "8rem 3rem",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse 50% 60% at 50% 50%, rgba(0,255,128,0.05) 0%, transparent 70%)",
        }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <h2 style={{
            fontSize: "clamp(2rem, 5vw, 4rem)",
            fontFamily: "'Georgia', serif",
            fontWeight: "900",
            color: "#fff",
            marginBottom: "1.5rem",
            lineHeight: 1.1,
          }}>
            Ready to catch fraud<br />
            <span style={{ color: "#00ff80" }}>before it happens?</span>
          </h2>
          <p style={{ color: "#555", marginBottom: "3rem", fontSize: "0.9rem", letterSpacing: "0.05em" }}>
            Login to your dashboard and start protecting your business today.
          </p>
          <button
            onClick={() => navigate("/login")}
            style={{
              backgroundColor: "#00ff80",
              color: "#070a0e",
              border: "none",
              borderRadius: "2px",
              padding: "1rem 3rem",
              cursor: "none",
              fontSize: "0.9rem",
              fontWeight: "bold",
              letterSpacing: "0.2em",
              fontFamily: "'Courier New', monospace",
              boxShadow: "0 0 40px rgba(0,255,128,0.4)",
              transition: "all 0.2s ease",
            }}
            onMouseOver={(e) => e.currentTarget.style.boxShadow = "0 0 60px rgba(0,255,128,0.7)"}
            onMouseOut={(e) => e.currentTarget.style.boxShadow = "0 0 40px rgba(0,255,128,0.4)"}
          >
            LOGIN TO DASHBOARD →
          </button>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{
        borderTop: "1px solid #111",
        padding: "2rem 3rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "1rem",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <div style={{ width: 6, height: 6, backgroundColor: "#00ff80", borderRadius: "50%" }} />
          <span style={{ fontSize: "0.8rem", color: "#333", letterSpacing: "0.2em" }}>SMARTEXPENSE</span>
        </div>
        <span style={{ fontSize: "0.75rem", color: "#333", letterSpacing: "0.1em" }}>
          FRAUD DETECTION SYSTEM © 2026
        </span>
      </footer>

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(8px); }
        }
       
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #070a0e; }
        ::-webkit-scrollbar-thumb { background: #00ff80; border-radius: 2px; }
      `}</style>
    </div>
  );
};

export default LandingPage;