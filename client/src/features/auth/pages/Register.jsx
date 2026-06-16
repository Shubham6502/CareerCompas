import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";
import { useAuthContext } from "../auth.context.jsx";
import { useTheme } from "../../../context/ThemeContext.jsx";
import { Eye, EyeOff, Mail, Lock, User, Sparkles, Check, ArrowRight } from "lucide-react";

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

/* Strength meter */
function PasswordStrength({ password }) {
  const score = !password ? 0
    : [/.{8,}/, /[A-Z]/, /[0-9]/, /[^A-Za-z0-9]/]
        .filter(r => r.test(password)).length;
  const bars   = [
    { min: 1, color: "#ef4444", label: "Weak" },
    { min: 2, color: "#f59e0b", label: "Fair" },
    { min: 3, color: "#3b82f6", label: "Good" },
    { min: 4, color: "#22c55e", label: "Strong" },
  ];
  if (!password) return null;
  const active = bars.filter(b => score >= b.min);
  const current = active[active.length - 1] || bars[0];
  return (
    <div style={{ marginTop: "8px" }}>
      <div style={{ display: "flex", gap: "4px", marginBottom: "4px" }}>
        {[1,2,3,4].map(i => (
          <div key={i} style={{
            flex: 1, height: "3px", borderRadius: "2px",
            background: score >= i ? current.color : "rgba(255,255,255,0.08)",
            transition: "background 0.3s",
          }}/>
        ))}
      </div>
      <span style={{ fontSize: "11px", color: current.color, fontWeight: 500 }}>{current.label}</span>
    </div>
  );
}

const FEATURES = [
  { icon: "🗺️", text: "Personalized AI-powered career roadmaps" },
  { icon: "📅", text: "Daily structured tasks across DSA, Dev & CS" },
  { icon: "⚡", text: "XP, streaks, and achievement badges" },
  { icon: "🌐", text: "Community roadmaps and leaderboards" },
];

const AVATARS = ["A", "R", "S", "M", "K"];

export default function Register() {
  const { loading, error } = useAuthContext();
  const { handleRegister } = useAuth();
  const { isDarkMode, setIsDarkMode } = useTheme();
  const navigate = useNavigate();

  const [showPass, setShowPass] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [validate, setValidate] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", password: "" });

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.firstName || !form.lastName || !form.email || !form.password) {
      setValidate("Please fill in all fields."); return;
    }
    if (!agreed) { setValidate("You must agree to the terms to register."); return; }
    if (form.password.length < 8) { setValidate("Password must be at least 8 characters."); return; }
    setValidate(null);
    try {
      await handleRegister(form.email, form.password, `${form.firstName} ${form.lastName}`);
    } catch (err) {}
  };

  /* Shared input style */
  const inputStyle = {
    width: "100%", padding: "11px 14px 11px 38px",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "10px", fontSize: "14px",
    color: "#e2e8f0", outline: "none",
    transition: "border-color 0.2s, background 0.2s",
    boxSizing: "border-box",
  };
  const onFocus = e => { e.target.style.borderColor = "rgba(139,92,246,0.6)"; e.target.style.background = "rgba(139,92,246,0.06)"; };
  const onBlur  = e => { e.target.style.borderColor = "rgba(255,255,255,0.1)";  e.target.style.background = "rgba(255,255,255,0.05)"; };

  return (
    <div style={{ minHeight: "100vh", background: "#080614", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px 16px", fontFamily: "'Inter',sans-serif", position: "relative", overflowX: "hidden" }}>

      {/* Ambient glows */}
      <div aria-hidden style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "-10%", right: "-5%",  width: "55vw", height: "60vh", background: "radial-gradient(ellipse, rgba(139,92,246,0.26) 0%, transparent 65%)", filter: "blur(8px)" }}/>
        <div style={{ position: "absolute", bottom: "-10%", left: "-5%", width: "45vw", height: "50vh", background: "radial-gradient(ellipse, rgba(20,184,166,0.14) 0%, transparent 65%)", filter: "blur(10px)" }}/>
      </div>

      <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: isMobile ? "460px" : "940px" }}>

        {/* Card */}
        <div style={{
          width: "100%", borderRadius: "20px", overflow: "hidden",
          border: "1px solid rgba(139,92,246,0.2)",
          display: isMobile ? "block" : "grid",
          gridTemplateColumns: "1fr 1fr",
          boxShadow: "0 0 0 1px rgba(255,255,255,0.04), 0 40px 80px rgba(0,0,0,0.7), 0 0 80px rgba(139,92,246,0.1)",
        }}>

          {/* ── LEFT PANEL ── */}
          {!isMobile && (
            <div style={{
              background: "linear-gradient(155deg,#130d2e 0%,#0e0820 55%,#090614 100%)",
              padding: "40px 36px", display: "flex", flexDirection: "column",
              justifyContent: "space-between", position: "relative", overflow: "hidden", minHeight: "680px",
            }}>
              {/* Inner glow */}
              <div aria-hidden style={{ position: "absolute", top: "-15%", left: "-20%", width: "70%", height: "65%", background: "radial-gradient(ellipse,rgba(139,92,246,0.28) 0%,transparent 70%)", filter: "blur(18px)", pointerEvents: "none" }}/>

              {/* Logo */}
              <div style={{ display: "flex", alignItems: "center", gap: "10px", position: "relative", zIndex: 2 }}>
                <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "linear-gradient(135deg,#7c3aed,#c026d3)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 18px rgba(192,38,211,0.5)" }}>
                  <Sparkles size={16} color="white"/>
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: "14px", color: "#fff", fontFamily: "var(--font-head,'Syne',sans-serif)" }}>CareerCompass</div>
                  <div style={{ fontSize: "10px", color: "rgba(167,139,250,0.65)" }}>Map your career. Land your dream role.</div>
                </div>
              </div>

              {/* Headline */}
              <div style={{ position: "relative", zIndex: 2, flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "28px 0" }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "11px", fontWeight: 600, padding: "5px 12px", borderRadius: "999px", marginBottom: "16px", background: "rgba(124,58,237,0.18)", border: "1px solid rgba(167,139,250,0.25)", color: "#c4b5fd", width: "fit-content" }}>
                  <Sparkles size={10}/> Free forever — No credit card required
                </div>

                <h1 style={{ fontFamily: "var(--font-head,'Syne',sans-serif)", fontSize: "34px", fontWeight: 800, lineHeight: 1.1, letterSpacing: "-0.02em", color: "#fff", marginBottom: "12px" }}>
                  Start your<br/>
                  <span style={{ background: "linear-gradient(90deg,#c084fc,#818cf8,#38bdf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                    career journey.
                  </span>
                </h1>
                <p style={{ fontSize: "13px", color: "rgba(167,139,250,0.7)", lineHeight: 1.6, maxWidth: "240px", marginBottom: "28px" }}>
                  Join thousands of learners building their path to top tech companies.
                </p>

                {/* Features */}
                <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "32px" }}>
                  {FEATURES.map((f, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <div style={{ width: "28px", height: "28px", borderRadius: "8px", background: "rgba(124,58,237,0.2)", border: "1px solid rgba(139,92,246,0.25)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", flexShrink: 0 }}>
                        {f.icon}
                      </div>
                      <span style={{ fontSize: "13px", color: "rgba(203,213,225,0.8)", lineHeight: 1.4 }}>{f.text}</span>
                    </div>
                  ))}
                </div>

                {/* Social proof */}
                <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "14px 16px", borderRadius: "12px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(139,92,246,0.15)" }}>
                  <div style={{ display: "flex" }}>
                    {AVATARS.map((a, i) => (
                      <div key={i} style={{ width: "26px", height: "26px", borderRadius: "50%", background: `linear-gradient(135deg, hsl(${260 + i*20},70%,55%), hsl(${280+i*20},70%,65%))`, border: "2px solid #0e0820", marginLeft: i === 0 ? 0 : "-8px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", fontWeight: 700, color: "#fff" }}>
                        {a}
                      </div>
                    ))}
                  </div>
                  <div>
                    <div style={{ fontSize: "12px", fontWeight: 600, color: "#fff" }}>Many learners</div>
                    <div style={{ fontSize: "11px", color: "rgba(148,163,184,0.6)" }}>already on their roadmap</div>
                  </div>
                </div>
              </div>

              {/* Stats row */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px", position: "relative", zIndex: 2 }}>
                {[["200+","Roadmaps"],["98%","Satisfaction"],["6mo","Avg. to hire"]].map(([val,lab],i)=>(
                  <div key={i} style={{ textAlign: "center", padding: "12px 8px", borderRadius: "10px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
                    <div style={{ fontFamily: "var(--font-head,'Syne',sans-serif)", fontSize: "18px", fontWeight: 700, color: "#c084fc" }}>{val}</div>
                    <div style={{ fontSize: "10px", color: "rgba(148,163,184,0.55)", marginTop: "2px" }}>{lab}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── RIGHT PANEL ── */}
          <div style={{ background: "#0f0b1e", padding: isMobile ? "36px 24px" : "40px 36px", display: "flex", flexDirection: "column", justifyContent: "center" }}>

            {/* Mobile logo */}
            {isMobile && (
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "28px" }}>
                <div style={{ width: "34px", height: "34px", borderRadius: "10px", background: "linear-gradient(135deg,#7c3aed,#c026d3)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 14px rgba(192,38,211,0.5)" }}>
                  <Sparkles size={15} color="white"/>
                </div>
                <span style={{ fontWeight: 700, fontSize: "14px", color: "#fff", fontFamily: "var(--font-head,'Syne',sans-serif)" }}>CareerCompass</span>
              </div>
            )}

            {/* Heading */}
            <div style={{ marginBottom: "24px" }}>
              <h2 style={{ fontFamily: "var(--font-head,'Syne',sans-serif)", fontSize: isMobile ? "22px" : "24px", fontWeight: 800, color: "#fff", marginBottom: "6px" }}>
                Create your account 🚀
              </h2>
              <p style={{ fontSize: "13px", color: "rgba(148,163,184,0.75)" }}>
                Already have an account?{" "}
                <Link to="/login" style={{ color: "#a855f7", fontWeight: 600, textDecoration: "none" }}
                  onMouseEnter={e=>e.target.style.color="#c084fc"}
                  onMouseLeave={e=>e.target.style.color="#a855f7"}>
                  Sign in
                </Link>
              </p>
            </div>

            {/* Google OAuth */}
            <button
              style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", padding: "12px", borderRadius: "10px", marginBottom: "18px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.12)", color: "#e2e8f0", fontSize: "14px", fontWeight: 600, cursor: "pointer", transition: "background 0.2s" }}
              onMouseEnter={e=>{e.currentTarget.style.background="rgba(255,255,255,0.08)";e.currentTarget.style.borderColor="rgba(255,255,255,0.2)";}}
              onMouseLeave={e=>{e.currentTarget.style.background="rgba(255,255,255,0.04)";e.currentTarget.style.borderColor="rgba(255,255,255,0.12)";}}>
              <GoogleIcon/> Continue with Google
            </button>

            {/* Divider */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "18px" }}>
              <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.08)" }}/>
              <span style={{ fontSize: "12px", color: "rgba(148,163,184,0.45)" }}>or sign up with email</span>
              <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.08)" }}/>
            </div>

            {/* Name row */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "12px" }}>
              {[
                { name: "firstName", placeholder: "John",  label: "First name" },
                { name: "lastName",  placeholder: "Doe",   label: "Last name"  },
              ].map(({ name, placeholder, label }) => (
                <div key={name}>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 500, color: "rgba(203,213,225,0.85)", marginBottom: "6px" }}>{label}</label>
                  <div style={{ position: "relative" }}>
                    <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "rgba(148,163,184,0.45)", display: "flex", pointerEvents: "none" }}>
                      <User size={14}/>
                    </span>
                    <input type="text" name={name} value={form[name]} onChange={handleChange}
                      placeholder={placeholder}
                      style={inputStyle} onFocus={onFocus} onBlur={onBlur}/>
                  </div>
                </div>
              ))}
            </div>

            {/* Email */}
            <div style={{ marginBottom: "12px" }}>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 500, color: "rgba(203,213,225,0.85)", marginBottom: "6px" }}>Email address</label>
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "rgba(148,163,184,0.45)", display: "flex", pointerEvents: "none" }}>
                  <Mail size={14}/>
                </span>
                <input type="email" name="email" value={form.email} onChange={handleChange}
                  placeholder="you@example.com"
                  style={inputStyle} onFocus={onFocus} onBlur={onBlur}/>
              </div>
            </div>

            {/* Password */}
            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 500, color: "rgba(203,213,225,0.85)", marginBottom: "6px" }}>Password</label>
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "rgba(148,163,184,0.45)", display: "flex", pointerEvents: "none" }}>
                  <Lock size={14}/>
                </span>
                <input type={showPass ? "text" : "password"} name="password" value={form.password} onChange={handleChange}
                  placeholder="Min. 8 characters"
                  style={{ ...inputStyle, paddingRight: "40px" }}
                  onFocus={onFocus} onBlur={onBlur}/>
                <button type="button" onClick={() => setShowPass(!showPass)}
                  style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "rgba(148,163,184,0.5)", display: "flex", padding: 0 }}>
                  {showPass ? <Eye size={15}/> : <EyeOff size={15}/>}
                </button>
              </div>
              <PasswordStrength password={form.password}/>
            </div>

            {/* Terms checkbox */}
            <label style={{ display: "flex", alignItems: "flex-start", gap: "10px", cursor: "pointer", marginBottom: "20px" }}>
              <div
                onClick={() => setAgreed(!agreed)}
                style={{
                  marginTop: "1px", width: "16px", height: "16px", borderRadius: "4px", flexShrink: 0,
                  border: agreed ? "none" : "1px solid rgba(255,255,255,0.2)",
                  background: agreed ? "linear-gradient(135deg,#7c3aed,#c026d3)" : "rgba(255,255,255,0.05)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "all 0.2s", cursor: "pointer",
                  boxShadow: agreed ? "0 0 10px rgba(139,92,246,0.4)" : "none",
                }}>
                {agreed && <Check size={10} color="white" strokeWidth={3}/>}
              </div>
              <span style={{ fontSize: "12px", color: "rgba(148,163,184,0.7)", lineHeight: 1.5 }}>
                I agree to the{" "}
                <a href="#" style={{ color: "#a855f7", textDecoration: "none" }}>Terms of Service</a>
                {" "}and{" "}
                <a href="#" style={{ color: "#a855f7", textDecoration: "none" }}>Privacy Policy</a>
              </span>
            </label>

            {/* Submit */}
            <button onClick={handleSubmit} disabled={loading}
              style={{
                width: "100%", padding: "13px", borderRadius: "10px",
                background: "linear-gradient(135deg,#7c3aed,#9333ea,#c026d3)",
                border: "none", fontSize: "14px", fontWeight: 700, color: "#fff",
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.7 : 1,
                boxShadow: "0 0 30px rgba(139,92,246,0.45)",
                display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                transition: "box-shadow 0.2s, transform 0.15s",
                marginBottom: "14px",
              }}
              onMouseEnter={e=>{if(!loading){e.currentTarget.style.boxShadow="0 0 50px rgba(139,92,246,0.7)";e.currentTarget.style.transform="translateY(-1px)";}}}
              onMouseLeave={e=>{e.currentTarget.style.boxShadow="0 0 30px rgba(139,92,246,0.45)";e.currentTarget.style.transform="translateY(0)";}}>
              {loading ? "Creating account…" : <><span>Create Account</span><ArrowRight size={16}/></>}
            </button>

            {/* Errors */}
            {(validate || error) && (
              <div style={{ padding: "10px 14px", borderRadius: "10px", marginBottom: "12px", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)", fontSize: "12px", color: "#f87171", textAlign: "center" }}>
                {validate || error}
              </div>
            )}

            {/* Bottom note */}
            <p style={{ textAlign: "center", fontSize: "11px", color: "rgba(148,163,184,0.35)", lineHeight: 1.5 }}>
              By creating an account, you agree to our{" "}
              <a href="#" style={{ color: "#a855f7", textDecoration: "none" }}>Terms</a> &{" "}
              <a href="#" style={{ color: "#a855f7", textDecoration: "none" }}>Privacy Policy</a>.
            </p>
          </div>

        </div>

        {/* Page footer */}
        {/* <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "center", gap: "16px", marginTop: "20px" }}>
          {["🔒 Your data is secure and encrypted", "Privacy Policy", "Terms of Service"].map((t, i) => (
            <span key={i} style={{ fontSize: "11px", color: "rgba(148,163,184,0.3)" }}>{t}</span>
          ))}
        </div> */}
      </div>
    </div>
  );
}