import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const features = [
    {
      icon: "01",
      title: "ML-Powered Detection",
      desc: "Random Forest model analyzes behavioral patterns, amount deviations, and transaction timing to predict fraud probability in real time.",
    },
    {
      icon: "02",
      title: "Rule-Based Engine",
      desc: "Hardcoded fraud rules catch blacklisted vendors, duplicate transactions, and threshold violations instantly.",
    },
    {
      icon: "03",
      title: "Combined Risk Score",
      desc: "ML score (70%) and rule score (30%) merge into one final verdict. No signal goes unheard. No transaction slips through.",
    },
    {
      icon: "04",
      title: "Admin Review System",
      desc: "Flagged transactions queue for admin approval or blocking. Every action is logged with a full audit trail.",
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

  const navLinks = [
    { label: "Features", id: "features" },
    { label: "How It Works", id: "how" },
    { label: "Contact", id: "contact" },
  ];

  return (
    <div style={{
      backgroundColor: "#ffffff",
      color: "#0a0a0a",
      fontFamily: "'Georgia', serif",
      overflowX: "hidden",
    }}>

      {/* ── NAVBAR ── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "1.2rem 4rem",
        backgroundColor: scrolled ? "rgba(255,255,255,0.97)" : "transparent",
        borderBottom: scrolled ? "1px solid #e8e8e8" : "1px solid transparent",
        transition: "all 0.3s ease",
      }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <div style={{
            width: 10, height: 10,
            backgroundColor: "#071e07",
            borderRadius: "50%",
          }} />
          <span style={{
            fontSize: "1rem",
            letterSpacing: "0.15em",
            color: "#071e07",
            fontWeight: "bold",
            fontFamily: "'Roboto', Arial, sans-serif",
          }}>
            SMARTEXPENSE
          </span>
        </div>

        {/* Nav links + Login */}
        <div style={{ display: "flex", alignItems: "center", gap: "2.5rem" }}>
          {navLinks.map((link) => (
            <span
              key={link.id}
              onClick={() => document.getElementById(link.id)?.scrollIntoView({ behavior: "smooth" })}
              style={{
                fontSize: "0.78rem",
                letterSpacing: "0.12em",
                color: "#555",
                cursor: "pointer",
                fontFamily: "'Gill Sans', sans-serif",
                transition: "color 0.2s ease",
              }}
              onMouseOver={(e) => e.currentTarget.style.color = "#071e07"}
              onMouseOut={(e) => e.currentTarget.style.color = "#555"}
            >
              {link.label}
            </span>
          ))}

          <button
            onClick={() => navigate("/login")}
            style={{
              backgroundColor: "#071e07",
              color: "#ffffff",
              border: "none",
              borderRadius: "3px",
              padding: "0.6rem 1.8rem",
              cursor: "pointer",
              fontSize: "0.82rem",
              letterSpacing: "0.1em",
              fontFamily: "'Gill Sans', sans-serif",
              transition: "all 0.2s ease",
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#0f3a0f"}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#071e07"}
          >
            Login →
          </button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "flex-start",
        padding: "10rem 4rem 6rem",
        maxWidth: 1100,
        margin: "0 auto",
        boxSizing: "border-box",
      }}>
        <div style={{
          display: "inline-block",
          fontSize: "0.72rem",
          letterSpacing: "0.35em",
          color: "#071e07",
          border: "1px solid #071e07",
          padding: "0.35rem 1rem",
          marginBottom: "2.5rem",
          fontFamily: "'Gill Sans', sans-serif",
        }}>
          FRAUD DETECTION SYSTEM
        </div>

        <h1 style={{
          fontSize: "clamp(2.8rem, 6vw, 5.5rem)",
          fontWeight: "900",
          lineHeight: 1.08,
          marginBottom: "2rem",
          color: "#0a0a0a",
          maxWidth: 750,
          fontFamily: "'Roboto', Arial, sans-serif",
        }}>
          Every Transaction Tells a Story.
          <br />
          We Read Between the Lines.
        </h1>

        <p style={{
          fontSize: "1.05rem",
          color: "#555",
          maxWidth: 480,
          marginBottom: "3rem",
          lineHeight: 1.9,
          fontFamily: "'Gill Sans', sans-serif",
        }}>
          Combining rule-based logic and machine learning to detect fraud before it costs you.
        </p>

        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          <button
            onClick={() => navigate("/login")}
            style={{
              backgroundColor: "#071e07",
              color: "#ffffff",
              border: "none",
              borderRadius: "3px",
              padding: "0.9rem 2.8rem",
              cursor: "pointer",
              fontSize: "0.88rem",
              letterSpacing: "0.1em",
              fontFamily: "'Georgia', serif",
              transition: "all 0.2s ease",
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#0f3a0f"}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#071e07"}
          >
            Get Started →
          </button>
          <button
            onClick={() => document.getElementById("how").scrollIntoView({ behavior: "smooth" })}
            style={{
              backgroundColor: "transparent",
              color: "#071e07",
              border: "1px solid #cccccc",
              borderRadius: "3px",
              padding: "0.9rem 2.8rem",
              cursor: "pointer",
              fontSize: "0.88rem",
              letterSpacing: "0.1em",
              fontFamily: "'Georgia', serif",
              transition: "all 0.2s ease",
            }}
            onMouseOver={(e) => e.currentTarget.style.borderColor = "#071e07"}
            onMouseOut={(e) => e.currentTarget.style.borderColor = "#cccccc"}
          >
            See How It Works
          </button>
        </div>
      </section>

      {/* ── STATS ── */}
      <section id="stats" style={{
        borderTop: "1px solid #e8e8e8",
        borderBottom: "1px solid #e8e8e8",
        padding: "4rem",
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: "2rem",
        maxWidth: 1100,
        margin: "0 auto",
      }}>
        {stats.map((s, i) => (
          <div key={i} style={{ textAlign: "center" }}>
            <div style={{
              fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)",
              fontWeight: "900",
              color: "#071e07",
              marginBottom: "0.4rem",
            }}>
              {s.value}
            </div>
            <div style={{
              fontSize: "0.72rem",
              letterSpacing: "0.2em",
              color: "#999",
              fontFamily: "'Gill Sans', sans-serif",
            }}>
              {s.label}
            </div>
          </div>
        ))}
      </section>

      {/* ── FEATURES ── */}
      <section id="features" style={{ padding: "7rem 4rem", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ marginBottom: "4rem" }}>
          <div style={{
            fontSize: "0.72rem", letterSpacing: "0.35em",
            color: "#071e07", marginBottom: "1rem",
            fontFamily: "'Gill Sans', sans-serif",
          }}>
            CAPABILITIES
          </div>
          <h2 style={{
            fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)",
            fontWeight: "700",
            color: "#0a0a0a",
            maxWidth: 480,
            lineHeight: 1.2,
            fontFamily: "'Roboto', Arial, sans-serif",
          }}>
            Built Different.{" "}
            <span style={{ color: "#aaaaaa" }}>Designed to catch what others miss.</span>
          </h2>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "1px",
          backgroundColor: "#e8e8e8",
          border: "1px solid #e8e8e8",
        }}>
          {features.map((f, i) => (
            <div
              key={i}
              style={{
                padding: "2.5rem",
                backgroundColor: "#ffffff",
                transition: "background-color 0.2s ease",
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#f7faf7"}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#ffffff"}
            >
              <div style={{
                fontSize: "0.72rem",
                letterSpacing: "0.2em",
                color: "#071e07",
                marginBottom: "1.2rem",
                fontFamily: "'Georgia', serif",
              }}>
                {f.icon}
              </div>
              <h3 style={{
                fontSize: "1rem",
                fontWeight: "bold",
                color: "#0a0a0a",
                marginBottom: "0.75rem",
                lineHeight: 1.4,
              }}>
                {f.title}
              </h3>
              <p style={{
                fontSize: "0.85rem",
                color: "#777",
                lineHeight: 1.9,
                fontFamily: "'Georgia', serif",
              }}>
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how" style={{
        padding: "7rem 4rem",
        backgroundColor: "#f9f9f9",
        borderTop: "4px solid #e8e8e8",
        borderBottom: "4px solid #e8e8e8",
      }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ marginBottom: "4rem" }}>
            <div style={{
              fontSize: "0.72rem", letterSpacing: "0.35em",
              color: "#071e07", marginBottom: "1rem",
              fontFamily: "'Roboto', Arial, sans-serif",
            }}>
              HOW IT WORKS
            </div>
            <h2 style={{
              fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)",
              fontWeight: "900",
              color: "#0a0a0a",
              lineHeight: 1.2,
              fontFamily: "'Roboto', Arial, sans-serif",
            }}>
              Three steps.{" "}
              <span style={{ color: "#aaaaaa" }}>Zero Tolerance.</span>
            </h2>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "4rem",
          }}>
            {steps.map((s, i) => (
              <div key={i}>
                <div style={{
                  fontSize: "3.5rem",
                  fontWeight: "900",
                  color: "#e8e8e8",
                  lineHeight: 1,
                  marginBottom: "1.2rem",
                }}>
                  {s.number}
                </div>
                <div style={{
                  width: "2rem",
                  height: "2px",
                  backgroundColor: "#071e07",
                  marginBottom: "1.2rem",
                }} />
                <h3 style={{
                  fontSize: "1.05rem",
                  fontWeight: "bold",
                  color: "#0a0a0a",
                  marginBottom: "0.75rem",
                }}>
                  {s.title}
                </h3>
                <p style={{
                  fontSize: "0.85rem",
                  color: "#777",
                  lineHeight: 1.9,
                  fontFamily: "'Roboto', sans-serif",
                }}>
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{
        padding: "8rem 4rem",
        textAlign: "center",
        maxWidth: 1100,
        margin: "0 auto",
      }}>
        <h2 style={{
          fontSize: "clamp(2rem, 4.5vw, 3.8rem)",
          fontWeight: "900",
          color: "#0a0a0a",
          marginBottom: "1.5rem",
          lineHeight: 1.1,
        }}>
          Ready to catch fraud
          <br />
          <span style={{ color: "#071e07" }}>before it happens?</span>
        </h2>
        <p style={{
          color: "#888",
          marginBottom: "3rem",
          fontSize: "0.95rem",
          lineHeight: 1.8,
          fontFamily: "'Gill Sans', sans-serif",
        }}>
          Login to your dashboard and start protecting your business today.
        </p>
        <button
          onClick={() => navigate("/login")}
          style={{
            backgroundColor: "#071e07",
            color: "#ffffff",
            border: "none",
            borderRadius: "3px",
            padding: "1rem 3.5rem",
            cursor: "pointer",
            fontSize: "0.9rem",
            letterSpacing: "0.1em",
            fontFamily: "'Georgia', serif",
            transition: "all 0.2s ease",
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#0f3a0f"}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#071e07"}
        >
          Login to Dashboard →
        </button>
      </section>

      {/* ── CONTACT ── */}
      <section id="contact" style={{
        padding: "7rem 4rem",
        backgroundColor: "#f9f9f9",
        borderTop: "1px solid #e8e8e8",
      }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6rem", alignItems: "start" }}>
          <div>
            <div style={{
              fontSize: "0.72rem", letterSpacing: "0.35em",
              color: "#071e07", marginBottom: "1rem",
              fontFamily: "'Gill Sans', sans-serif",
            }}>
              CONTACT & SUPPORT
            </div>
            <h2 style={{
              fontSize: "clamp(1.6rem, 3vw, 2.4rem)",
              fontWeight: "900",
              color: "#0a0a0a",
              lineHeight: 1.2,
              marginBottom: "1.5rem",
              fontFamily: "'Roboto', Arial, sans-serif",
            }}>
              Lets Get In Touch{" "}
              
            </h2>
            <p style={{
              fontSize: "0.88rem",
              color: "#0a2b0c",
              lineHeight: 1.9,
              fontFamily: "'Gill Sans', sans-serif",
              maxWidth: 360,
            }}>
              Reach out for support, feature requests, or to report an issue. Our team typically responds within one business day.
            </p>
            <div style={{ marginTop: "2rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {[
                { label: "Email", value: "shelbyadede@gmail.com"},
                { label: "Phone", value: "+254707887162" },
              ].map((item) => (
                <div key={item.label} style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                  <span style={{ fontSize: "0.7rem", letterSpacing: "0.1em", color: "#000000", fontFamily: "'Gill Sans', sans-serif", width: 40 }}>{item.label}</span>
                  <span style={{ fontSize: "0.85rem", color: "#071e07", fontFamily: "'Gill Sans', sans-serif" }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Simple contact form */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
            {["Your Name", "Your Email"].map((placeholder) => (
              <input
                key={placeholder}
                type="text"
                placeholder={placeholder}
                style={{
                  border: "1px solid #ddd",
                  borderRadius: "3px",
                  padding: "0.85rem 1.2rem",
                  fontSize: "0.85rem",
                  fontFamily: "'Gill Sans', sans-serif",
                  color: "#333",
                  outline: "none",
                  transition: "border-color 0.2s",
                  backgroundColor: "#fff",
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = "#071e07"}
                onBlur={(e) => e.currentTarget.style.borderColor = "#ddd"}
              />
            ))}
            <textarea
              placeholder="Your message..."
              rows={5}
              style={{
                border: "1px solid #ddd",
                borderRadius: "3px",
                padding: "0.85rem 1.2rem",
                fontSize: "0.85rem",
                fontFamily: "'Gill Sans', sans-serif",
                color: "#333",
                outline: "none",
                resize: "vertical",
                transition: "border-color 0.2s",
                backgroundColor: "#fff",
              }}
              onFocus={(e) => e.currentTarget.style.borderColor = "#071e07"}
              onBlur={(e) => e.currentTarget.style.borderColor = "#ddd"}
            />
            <button
              style={{
                backgroundColor: "#071e07",
                color: "#ffffff",
                border: "none",
                borderRadius: "3px",
                padding: "0.85rem 2rem",
                cursor: "pointer",
                fontSize: "0.82rem",
                letterSpacing: "0.1em",
                fontFamily: "'Gill Sans', sans-serif",
                alignSelf: "flex-start",
                transition: "background-color 0.2s ease",
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#0f3a0f"}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#071e07"}
            >
              Send Message →
            </button>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{
        borderTop: "1px solid #e8e8e8",
        padding: "2rem 4rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "1rem",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <div style={{ width: 7, height: 7, backgroundColor: "#071e07", borderRadius: "50%" }} />
          <span style={{
            fontSize: "0.82rem",
            color: "#071e07",
            letterSpacing: "0.15em",
            fontFamily: "'Gill Sans', sans-serif",
          }}>
            SMARTEXPENSE
          </span>
        </div>
        <span style={{
          fontSize: "0.75rem",
          color: "#aaa",
          letterSpacing: "0.1em",
          fontFamily: "'Gill Sans', sans-serif",
        }}>
          FRAUD DETECTION SYSTEM © 2026
        </span>
      </footer>

      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #ffffff; }
        ::-webkit-scrollbar-thumb { background: #071e07; border-radius: 2px; }

        @media (max-width: 768px) {
          nav { padding: 1rem 1.5rem !important; }
          nav > div:last-child { gap: 1.2rem !important; }
          nav span { display: none; }
          section { padding-left: 1.5rem !important; padding-right: 1.5rem !important; }
          footer { padding: 1.5rem !important; }
        }
      `}</style>
    </div>
  );
};

export default LandingPage;