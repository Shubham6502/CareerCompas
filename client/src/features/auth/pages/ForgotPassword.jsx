import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Mail,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  RefreshCw,
  CheckCircle,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";

/* ── Animated checkmark for success state ── */
const SuccessCheck = () => (
  <div
    style={{
      width: "64px",
      height: "64px",
      borderRadius: "50%",
      margin: "0 auto 20px",
      background: "linear-gradient(135deg, #22c55e, #16a34a)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: "0 0 32px rgba(34,197,94,0.45)",
      animation: "popIn 0.4s cubic-bezier(0.34,1.56,0.64,1)",
    }}
  >
    <CheckCircle size={32} color="white" />
    <style>{`@keyframes popIn { from { transform: scale(0); opacity: 0; } to { transform: scale(1); opacity: 1; } }`}</style>
  </div>
);

/* ── Single OTP digit box ── */
function OtpBox({ value, inputRef, onChange, onKeyDown, onPaste, index }) {
  const [focused, setFocused] = useState(false);
  return (
    <input
      ref={inputRef}
      type="text"
      inputMode="numeric"
      maxLength={1}
      value={value}
      onChange={(e) => onChange(e, index)}
      onKeyDown={(e) => onKeyDown(e, index)}
      onPaste={onPaste}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{
        width: "52px",
        height: "60px",
        textAlign: "center",
        fontSize: "22px",
        fontWeight: 700,
        color: "#fff",
        caretColor: "#a855f7",
        background: value ? "rgba(139,92,246,0.12)" : "rgba(255,255,255,0.05)",
        border: `2px solid ${value ? "rgba(139,92,246,0.7)" : focused ? "rgba(139,92,246,0.5)" : "rgba(255,255,255,0.1)"}`,
        borderRadius: "12px",
        outline: "none",
        transition: "all 0.2s",
        boxShadow: focused || value ? "0 0 16px rgba(139,92,246,0.25)" : "none",
        fontFamily: "var(--font-head,'Syne',sans-serif)",
      }}
    />
  );
}

/* ── Countdown timer ── */
function Countdown({ seconds, onDone }) {
  const [remaining, setRemaining] = useState(seconds);
  useEffect(() => {
    setRemaining(seconds);
    const id = setInterval(
      () =>
        setRemaining((r) => {
          if (r <= 1) {
            clearInterval(id);
            onDone();
            return 0;
          }
          return r - 1;
        }),
      1000,
    );
    return () => clearInterval(id);
  }, [seconds]);
  const pct = (remaining / seconds) * 100;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        justifyContent: "center",
      }}
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 36 36"
        style={{ transform: "rotate(-90deg)", flexShrink: 0 }}
      >
        <circle
          cx="18"
          cy="18"
          r="15"
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="3"
        />
        <circle
          cx="18"
          cy="18"
          r="15"
          fill="none"
          stroke="#a855f7"
          strokeWidth="3"
          strokeDasharray={`${2 * Math.PI * 15}`}
          strokeDashoffset={`${2 * Math.PI * 15 * (1 - pct / 100)}`}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 1s linear" }}
        />
      </svg>
      <span style={{ fontSize: "13px", color: "rgba(148,163,184,0.7)" }}>
        Resend in{" "}
        <span style={{ color: "#a855f7", fontWeight: 600 }}>{remaining}s</span>
      </span>
    </div>
  );
}

const STEPS = ["email", "otp", "reset", "done"];

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState("email"); // email | otp | reset | done
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [canResend, setCanResend] = useState(false);
  const [resendKey, setResendKey] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const otpRefs = useRef([]);

  const { handleOtpMail, handleVerifySentOtp, otpError,handleResetPassword } = useAuth();

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  /* ── Step 1: Send OTP ── */
  const handleSendOtp = async () => {
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    try {
      setError("");
      setLoading(true);
      const response = await handleOtpMail(email);
      setCanResend(false);
      setStep("otp");
      setTimeout(() => otpRefs.current[0]?.focus(), 100);
    } catch (error) {
      setError(error.response?.data?.message || "Error sending OTP");
    } finally {
      setLoading(false);
    }
    setTimeout(() => otpRefs.current[0]?.focus(), 100);
  };

  /* ── OTP input handlers ── */
  const handleOtpChange = (e, i) => {
    const val = e.target.value.replace(/\D/, "");
    if (!val) return;
    const next = [...otp];
    next[i] = val;
    setOtp(next);
    if (i < 5) otpRefs.current[i + 1]?.focus();
  };
  const handleOtpKey = (e, i) => {
    if (e.key === "Backspace") {
      const next = [...otp];
      next[i] = "";
      setOtp(next);
      if (i > 0) otpRefs.current[i - 1]?.focus();
    }
    if (e.key === "ArrowLeft" && i > 0) otpRefs.current[i - 1]?.focus();
    if (e.key === "ArrowRight" && i < 5) otpRefs.current[i + 1]?.focus();
  };
  const handleOtpPaste = (e) => {
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    if (pasted.length === 6) {
      setOtp(pasted.split(""));
      otpRefs.current[5]?.focus();
    }
  };

  /* ── Step 2: Verify OTP ── */
  const handleVerifyOtp = async () => {
    if (otp.some((d) => !d)) {
      setError("Please enter all 6 digits.");
      return;
    }

    try {
      setError("");
      setLoading(true);
      await handleVerifySentOtp(email, otp.join(""));
      setStep("reset");
    } catch (error) {
      setError(error.response?.data?.message || "Error verifying OTP");
    } finally {
      setLoading(false);
    }
  };

  /* ── Step 3: Reset password ── */
  const handleReset = async () => {
    if (newPass.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (newPass !== confirmPass) {
      setError("Passwords do not match.");
      return;
    }
    setError("");
    setLoading(true);
    await handleResetPassword(email, newPass);
    setLoading(false);
    setStep("done");
  };

  /* ── Resend OTP ── */
  const handleResend = async () => {
    setCanResend(false);
    setOtp(["", "", "", "", "", ""]);
    setResendKey((k) => k + 1);
    await handleOtpMail(email);
    await new Promise((r) => setTimeout(r, 800));
    otpRefs.current[0]?.focus();
  };

  /* ── Shared styles ── */
  const inputStyle = {
    width: "100%",
    padding: "12px 14px 12px 40px",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "10px",
    fontSize: "14px",
    color: "#e2e8f0",
    outline: "none",
    transition: "border-color 0.2s, background 0.2s",
    boxSizing: "border-box",
  };
  const onFocus = (e) => {
    e.target.style.borderColor = "rgba(139,92,246,0.6)";
    e.target.style.background = "rgba(139,92,246,0.06)";
  };
  const onBlur = (e) => {
    e.target.style.borderColor = "rgba(255,255,255,0.1)";
    e.target.style.background = "rgba(255,255,255,0.05)";
  };

  const btnStyle = {
    width: "100%",
    padding: "13px",
    borderRadius: "10px",
    background: "linear-gradient(135deg,#7c3aed,#9333ea,#c026d3)",
    border: "none",
    fontSize: "14px",
    fontWeight: 700,
    color: "#fff",
    cursor: loading ? "not-allowed" : "pointer",
    opacity: loading ? 0.7 : 1,
    boxShadow: "0 0 30px rgba(139,92,246,0.4)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    transition: "box-shadow 0.2s, transform 0.15s",
  };

  /* ── Step indicator ── */
  const stepIndex = STEPS.indexOf(step);
  const stepLabels = ["Email", "Verify OTP", "New Password", "Done"];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#080614",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px 16px",
        fontFamily: "'Inter',sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Ambient glows */}
      <div
        aria-hidden
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "-10%",
            left: "10%",
            width: "55vw",
            height: "60vh",
            background:
              "radial-gradient(ellipse,rgba(139,92,246,0.25) 0%,transparent 65%)",
            filter: "blur(8px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-10%",
            right: "-5%",
            width: "40vw",
            height: "50vh",
            background:
              "radial-gradient(ellipse,rgba(20,184,166,0.12) 0%,transparent 65%)",
            filter: "blur(10px)",
          }}
        />
      </div>

      <div
        style={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          maxWidth: "440px",
        }}
      >
        {/* Back link */}
        <Link
          to="/login"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            fontSize: "13px",
            color: "rgba(148,163,184,0.6)",
            textDecoration: "none",
            marginBottom: "24px",
            transition: "color 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#a855f7")}
          onMouseLeave={(e) =>
            (e.currentTarget.style.color = "rgba(148,163,184,0.6)")
          }
        >
          <ArrowLeft size={14} /> Back to login
        </Link>

        {/* Card */}
        <div
          style={{
            background: "#0f0b1e",
            borderRadius: "20px",
            border: "1px solid rgba(139,92,246,0.2)",
            padding: isMobile ? "28px 20px" : "40px 36px",
            boxShadow:
              "0 0 0 1px rgba(255,255,255,0.04), 0 40px 80px rgba(0,0,0,0.7), 0 0 60px rgba(139,92,246,0.08)",
          }}
        >
          {/* Logo */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "32px",
            }}
          >
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "9px",
                background: "linear-gradient(135deg,#7c3aed,#c026d3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 0 14px rgba(192,38,211,0.45)",
              }}
            >
              <Sparkles size={14} color="white" />
            </div>
            <span
              style={{
                fontWeight: 700,
                fontSize: "14px",
                color: "#fff",
                fontFamily: "var(--font-head,'Syne',sans-serif)",
              }}
            >
              CareerCompass
            </span>
          </div>

          {/* Step progress */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0",
              marginBottom: "32px",
            }}
          >
            {stepLabels.map((label, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  position: "relative",
                }}
              >
                {/* Connector line */}
                {i < stepLabels.length - 1 && (
                  <div
                    style={{
                      position: "absolute",
                      top: "12px",
                      left: "50%",
                      width: "100%",
                      height: "2px",
                      background:
                        i < stepIndex
                          ? "linear-gradient(90deg,#7c3aed,#c026d3)"
                          : "rgba(255,255,255,0.08)",
                      transition: "background 0.4s",
                      zIndex: 0,
                    }}
                  />
                )}
                {/* Dot */}
                <div
                  style={{
                    width: "24px",
                    height: "24px",
                    borderRadius: "50%",
                    zIndex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "11px",
                    fontWeight: 700,
                    background:
                      i < stepIndex
                        ? "linear-gradient(135deg,#7c3aed,#c026d3)"
                        : i === stepIndex
                          ? "rgba(139,92,246,0.25)"
                          : "rgba(255,255,255,0.06)",
                    border:
                      i === stepIndex
                        ? "2px solid #a855f7"
                        : i < stepIndex
                          ? "none"
                          : "2px solid rgba(255,255,255,0.1)",
                    color: i <= stepIndex ? "#fff" : "rgba(148,163,184,0.4)",
                    boxShadow:
                      i === stepIndex
                        ? "0 0 12px rgba(139,92,246,0.5)"
                        : "none",
                    transition: "all 0.3s",
                  }}
                >
                  {i < stepIndex ? "✓" : i + 1}
                </div>
                <span
                  style={{
                    fontSize: "10px",
                    marginTop: "5px",
                    color:
                      i === stepIndex
                        ? "#a855f7"
                        : i < stepIndex
                          ? "rgba(167,139,250,0.6)"
                          : "rgba(148,163,184,0.35)",
                    fontWeight: i === stepIndex ? 600 : 400,
                    whiteSpace: "nowrap",
                  }}
                >
                  {label}
                </span>
              </div>
            ))}
          </div>

          {/* ── STEP: EMAIL ── */}
          {step === "email" && (
            <div>
              <div style={{ marginBottom: "28px" }}>
                <h2
                  style={{
                    fontFamily: "var(--font-head,'Syne',sans-serif)",
                    fontSize: "22px",
                    fontWeight: 800,
                    color: "#fff",
                    marginBottom: "6px",
                  }}
                >
                  Forgot password?
                </h2>
                <p
                  style={{
                    fontSize: "13px",
                    color: "rgba(148,163,184,0.7)",
                    lineHeight: 1.6,
                  }}
                >
                  No worries! Enter your email and we'll send you a 6-digit OTP
                  to reset your password.
                </p>
              </div>

              {/* Email icon visual */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginBottom: "28px",
                }}
              >
                <div
                  style={{
                    width: "72px",
                    height: "72px",
                    borderRadius: "20px",
                    background: "rgba(124,58,237,0.15)",
                    border: "1px solid rgba(139,92,246,0.25)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 0 30px rgba(139,92,246,0.2)",
                  }}
                >
                  <Mail size={32} color="#a855f7" />
                </div>
              </div>

              <div style={{ marginBottom: "16px" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "12px",
                    fontWeight: 500,
                    color: "rgba(203,213,225,0.85)",
                    marginBottom: "6px",
                  }}
                >
                  Email address
                </label>
                <div style={{ position: "relative" }}>
                  <span
                    style={{
                      position: "absolute",
                      left: "12px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "rgba(148,163,184,0.45)",
                      display: "flex",
                      pointerEvents: "none",
                    }}
                  >
                    <Mail size={15} />
                  </span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError("");
                    }}
                    placeholder="you@example.com"
                    onKeyDown={(e) => e.key === "Enter" && handleSendOtp()}
                    style={inputStyle}
                    onFocus={onFocus}
                    onBlur={onBlur}
                  />
                </div>
              </div>

              {error && <ErrorBox msg={error} />}

              <button
                onClick={handleSendOtp}
                disabled={loading}
                style={btnStyle}
                onMouseEnter={(e) => {
                  if (!loading) {
                    e.currentTarget.style.boxShadow =
                      "0 0 50px rgba(139,92,246,0.7)";
                    e.currentTarget.style.transform = "translateY(-1px)";
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow =
                    "0 0 30px rgba(139,92,246,0.4)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                {loading ? (
                  <Spinner />
                ) : (
                  <>
                    <span>Send OTP</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </div>
          )}

          {/* ── STEP: OTP ── */}
          {step === "otp" && (
            <div>
              <div style={{ marginBottom: "24px" }}>
                <h2
                  style={{
                    fontFamily: "var(--font-head,'Syne',sans-serif)",
                    fontSize: "22px",
                    fontWeight: 800,
                    color: "#fff",
                    marginBottom: "6px",
                  }}
                >
                  Check your email
                </h2>
                <p
                  style={{
                    fontSize: "13px",
                    color: "rgba(148,163,184,0.7)",
                    lineHeight: 1.6,
                  }}
                >
                  We sent a 6-digit code to{" "}
                  <span style={{ color: "#a855f7", fontWeight: 600 }}>
                    {email}
                  </span>
                  . Enter it below.
                </p>
              </div>

              {/* OTP boxes */}
              <div
                style={{
                  display: "flex",
                  gap: "8px",
                  justifyContent: "center",
                  marginBottom: "24px",
                }}
              >
                {otp.map((digit, i) => (
                  <OtpBox
                    key={i}
                    index={i}
                    value={digit}
                    inputRef={(el) => (otpRefs.current[i] = el)}
                    onChange={handleOtpChange}
                    onKeyDown={handleOtpKey}
                    onPaste={handleOtpPaste}
                  />
                ))}
              </div>

              {/* Resend */}
              <div style={{ textAlign: "center", marginBottom: "20px" }}>
                {canResend ? (
                  <button
                    onClick={handleResend}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "#a855f7",
                      fontSize: "13px",
                      fontWeight: 600,
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color = "#c084fc")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = "#a855f7")
                    }
                  >
                    <RefreshCw size={13} /> Resend code
                  </button>
                ) : (
                  <Countdown
                    key={resendKey}
                    seconds={60}
                    onDone={() => setCanResend(true)}
                  />
                )}
              </div>

              {error && <ErrorBox msg={error} />}

              <button
                onClick={handleVerifyOtp}
                disabled={loading}
                style={btnStyle}
                onMouseEnter={(e) => {
                  if (!loading) {
                    e.currentTarget.style.boxShadow =
                      "0 0 50px rgba(139,92,246,0.7)";
                    e.currentTarget.style.transform = "translateY(-1px)";
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow =
                    "0 0 30px rgba(139,92,246,0.4)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                {loading ? (
                  <Spinner />
                ) : (
                  <>
                    <span>Verify OTP</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>

              <button
                onClick={() => {
                  setStep("email");
                  setOtp(["", "", "", "", "", ""]);
                  setError("");
                }}
                style={{
                  width: "100%",
                  marginTop: "12px",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "13px",
                  color: "rgba(148,163,184,0.55)",
                  textAlign: "center",
                  padding: "8px",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#a855f7")}
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "rgba(148,163,184,0.55)")
                }
              >
                ← Use a different email
              </button>
            </div>
          )}

          {/* ── STEP: RESET ── */}
          {step === "reset" && (
            <div>
              <div style={{ marginBottom: "28px" }}>
                <h2
                  style={{
                    fontFamily: "var(--font-head,'Syne',sans-serif)",
                    fontSize: "22px",
                    fontWeight: 800,
                    color: "#fff",
                    marginBottom: "6px",
                  }}
                >
                  Set new password
                </h2>
                <p
                  style={{
                    fontSize: "13px",
                    color: "rgba(148,163,184,0.7)",
                    lineHeight: 1.6,
                  }}
                >
                  Almost there! Create a strong password for your account.
                </p>
              </div>

              {/* Password fields */}
              <div style={{ marginBottom: "14px" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "12px",
                    fontWeight: 500,
                    color: "rgba(203,213,225,0.85)",
                    marginBottom: "6px",
                  }}
                >
                  New password
                </label>
                <div style={{ position: "relative" }}>
                  <span
                    style={{
                      position: "absolute",
                      left: "12px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "rgba(148,163,184,0.45)",
                      display: "flex",
                      pointerEvents: "none",
                    }}
                  >
                    <Lock size={15} />
                  </span>
                  <input
                    type={showNew ? "text" : "password"}
                    value={newPass}
                    onChange={(e) => {
                      setNewPass(e.target.value);
                      setError("");
                    }}
                    placeholder="Min. 8 characters"
                    style={{ ...inputStyle, paddingRight: "40px" }}
                    onFocus={onFocus}
                    onBlur={onBlur}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    style={{
                      position: "absolute",
                      right: "12px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "rgba(148,163,184,0.5)",
                      display: "flex",
                      padding: 0,
                    }}
                  >
                    {showNew ? <Eye size={15} /> : <EyeOff size={15} />}
                  </button>
                </div>
                {/* Strength bars */}
                {newPass && <PasswordStrength password={newPass} />}
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "12px",
                    fontWeight: 500,
                    color: "rgba(203,213,225,0.85)",
                    marginBottom: "6px",
                  }}
                >
                  Confirm password
                </label>
                <div style={{ position: "relative" }}>
                  <span
                    style={{
                      position: "absolute",
                      left: "12px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "rgba(148,163,184,0.45)",
                      display: "flex",
                      pointerEvents: "none",
                    }}
                  >
                    <Lock size={15} />
                  </span>
                  <input
                    type={showConfirm ? "text" : "password"}
                    value={confirmPass}
                    onChange={(e) => {
                      setConfirmPass(e.target.value);
                      setError("");
                    }}
                    placeholder="Repeat your password"
                    style={{
                      ...inputStyle,
                      paddingRight: "40px",
                      borderColor:
                        confirmPass && confirmPass !== newPass
                          ? "rgba(239,68,68,0.5)"
                          : undefined,
                    }}
                    onFocus={onFocus}
                    onBlur={onBlur}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    style={{
                      position: "absolute",
                      right: "12px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "rgba(148,163,184,0.5)",
                      display: "flex",
                      padding: 0,
                    }}
                  >
                    {showConfirm ? <Eye size={15} /> : <EyeOff size={15} />}
                  </button>
                </div>
                {confirmPass && confirmPass !== newPass && (
                  <span
                    style={{
                      fontSize: "11px",
                      color: "#f87171",
                      marginTop: "4px",
                      display: "block",
                    }}
                  >
                    Passwords don't match
                  </span>
                )}
                {confirmPass && confirmPass === newPass && (
                  <span
                    style={{
                      fontSize: "11px",
                      color: "#22c55e",
                      marginTop: "4px",
                      display: "block",
                    }}
                  >
                    ✓ Passwords match
                  </span>
                )}
              </div>

              {error && <ErrorBox msg={error} />}

              <button
                onClick={handleReset}
                disabled={loading}
                style={btnStyle}
                onMouseEnter={(e) => {
                  if (!loading) {
                    e.currentTarget.style.boxShadow =
                      "0 0 50px rgba(139,92,246,0.7)";
                    e.currentTarget.style.transform = "translateY(-1px)";
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow =
                    "0 0 30px rgba(139,92,246,0.4)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                {loading ? (
                  <Spinner />
                ) : (
                  <>
                    <span>Reset Password</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </div>
          )}

          {/* ── STEP: DONE ── */}
          {step === "done" && (
            <div style={{ textAlign: "center", padding: "12px 0" }}>
              <SuccessCheck />
              <h2
                style={{
                  fontFamily: "var(--font-head,'Syne',sans-serif)",
                  fontSize: "22px",
                  fontWeight: 800,
                  color: "#fff",
                  marginBottom: "10px",
                }}
              >
                Password reset! 🎉
              </h2>
              <p
                style={{
                  fontSize: "13px",
                  color: "rgba(148,163,184,0.7)",
                  lineHeight: 1.6,
                  marginBottom: "32px",
                  maxWidth: "280px",
                  margin: "0 auto 32px",
                }}
              >
                Your password has been updated successfully. You can now log in
                with your new password.
              </p>
              <button
                onClick={() => navigate("/login")}
                style={{ ...btnStyle, maxWidth: "240px", margin: "0 auto" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow =
                    "0 0 50px rgba(139,92,246,0.7)";
                  e.currentTarget.style.transform = "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow =
                    "0 0 30px rgba(139,92,246,0.4)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                Back to Login <ArrowRight size={16} />
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "center",
            gap: "16px",
            marginTop: "20px",
          }}
        >
          {[
            "🔒 Your data is secure and encrypted",
            "Privacy Policy",
            "Terms of Service",
          ].map((t, i) => (
            <span
              key={i}
              style={{ fontSize: "11px", color: "rgba(148,163,184,0.3)" }}
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Small reusable sub-components ── */
function ErrorBox({ msg }) {
  return (
    <div
      style={{
        padding: "10px 14px",
        borderRadius: "10px",
        marginBottom: "14px",
        background: "rgba(239,68,68,0.08)",
        border: "1px solid rgba(239,68,68,0.25)",
        fontSize: "12px",
        color: "#f87171",
        textAlign: "center",
      }}
    >
      {msg}
    </div>
  );
}

function Spinner() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="white"
      strokeWidth="2.5"
      strokeLinecap="round"
      style={{ animation: "spin 0.8s linear infinite" }}
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </svg>
  );
}

function PasswordStrength({ password }) {
  const score = [/.{8,}/, /[A-Z]/, /[0-9]/, /[^A-Za-z0-9]/].filter((r) =>
    r.test(password),
  ).length;
  const levels = [
    { color: "#ef4444", label: "Weak" },
    { color: "#f59e0b", label: "Fair" },
    { color: "#3b82f6", label: "Good" },
    { color: "#22c55e", label: "Strong" },
  ];
  const current = levels[Math.max(0, score - 1)];
  return (
    <div style={{ marginTop: "8px" }}>
      <div style={{ display: "flex", gap: "4px", marginBottom: "4px" }}>
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            style={{
              flex: 1,
              height: "3px",
              borderRadius: "2px",
              background: score >= i ? current.color : "rgba(255,255,255,0.08)",
              transition: "background 0.3s",
            }}
          />
        ))}
      </div>
      <span style={{ fontSize: "11px", color: current.color, fontWeight: 500 }}>
        {current.label} password
      </span>
    </div>
  );
}
