import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";
import { useAuthContext } from "../auth.context.jsx";
import { useTheme } from "../../../context/ThemeContext.jsx";
import { Eye, EyeOff, Mail, Lock, Sparkles } from "lucide-react";


const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const GlowMountain = () => (
  <svg viewBox="0 0 340 380" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", maxWidth: "280px", margin: "0 auto", display: "block" }}>
    <defs>
      <filter id="glow"><feGaussianBlur stdDeviation="4" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      <filter id="glow2"><feGaussianBlur stdDeviation="9" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      <linearGradient id="pg" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#a855f7"/><stop offset="100%" stopColor="#6366f1"/></linearGradient>
    </defs>
    <path d="M20 360 L170 40 L320 360 Z" fill="rgba(88,28,135,0.15)" stroke="rgba(139,92,246,0.15)" strokeWidth="1"/>
    <path d="M70 360 L170 100 L270 360 Z" fill="rgba(109,40,217,0.1)"/>
    <path d="M170 350 L115 270 L205 195 L135 125 L170 60" stroke="url(#pg)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" filter="url(#glow2)" opacity="0.95"/>
    <path d="M170 350 L115 270 L205 195 L135 125 L170 60" stroke="#c084fc" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.5"/>
    {[[170,350],[115,270],[205,195],[135,125]].map(([cx,cy],i)=>(
      <g key={i} filter="url(#glow)">
        <circle cx={cx} cy={cy} r="8" fill="rgba(139,92,246,0.25)" stroke="#a855f7" strokeWidth="1.5"/>
        <circle cx={cx} cy={cy} r="3.5" fill="#c084fc"/>
      </g>
    ))}
    <g filter="url(#glow)">
      <line x1="170" y1="60" x2="170" y2="28" stroke="#a855f7" strokeWidth="2"/>
      <polygon points="170,28 193,42 170,56" fill="#c026d3"/>
    </g>
    <ellipse cx="170" cy="357" rx="130" ry="7" fill="rgba(139,92,246,0.18)" filter="url(#glow2)"/>
  </svg>
);

const FloatingBadge = ({ icon, label, className }) => (
  <div className={`absolute flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-purple-100 backdrop-blur-md border border-purple-500/25 shadow-lg shadow-purple-900/30 whitespace-nowrap ${className}`}
    style={{ background: "rgba(30,15,60,0.85)" }}>
    <span className="text-purple-400 text-sm">{icon}</span>
    {label}
  </div>
);

export default function Login() {
  const { user } = useAuthContext();
  const { isDarkMode, setIsDarkMode } = useTheme();
  const [showPass, setShowPass] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const { handleLogin, error, setError, loading } = useAuth();
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.email || !form.password) { setError("Please fill in all fields"); return; }
    handleLogin(form.email, form.password);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 sm:py-8 relative overflow-hidden"
      style={{ background: "#080614", fontFamily: "'Inter',sans-serif" }}>

      {/* Ambient glows — fixed behind everything */}
      <div aria-hidden className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute" style={{ top:"-5%", left:"5%", width:"55vw", height:"55vh", background:"radial-gradient(ellipse, rgba(139,92,246,0.28) 0%, transparent 65%)", filter:"blur(8px)" }}/>
        <div className="absolute" style={{ bottom:"-10%", right:"-5%", width:"40vw", height:"45vh", background:"radial-gradient(ellipse, rgba(20,184,166,0.14) 0%, transparent 65%)", filter:"blur(10px)" }}/>
      </div>

      {/* Card */}
      <div className="relative z-10 w-full"
        style={{ maxWidth: isMobile ? "440px" : "900px" }}>
        <div className="w-full rounded-2xl overflow-hidden border border-purple-900/40 shadow-2xl"
          style={{
            display: isMobile ? "block" : "grid",
            gridTemplateColumns: "1fr 1fr",
            boxShadow: "0 0 0 1px rgba(255,255,255,0.04), 0 40px 80px rgba(0,0,0,0.7), 0 0 80px rgba(139,92,246,0.1)",
          }}>

          {/* ── LEFT PANEL (hidden on mobile) ── */}
          {!isMobile && (
            <div className="relative flex flex-col justify-between p-9 overflow-hidden"
              style={{ background: "linear-gradient(155deg,#130d2e 0%,#0e0820 55%,#090614 100%)", minHeight: "620px" }}>

              {/* Inner glow */}
              <div aria-hidden className="absolute pointer-events-none"
                style={{ top:"-15%", right:"-20%", width:"70%", height:"65%", background:"radial-gradient(ellipse,rgba(139,92,246,0.32) 0%,transparent 70%)", filter:"blur(18px)" }}/>

              {/* Logo */}
              <div className="flex items-center gap-3 relative z-10">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background:"linear-gradient(135deg,#7c3aed,#c026d3)", boxShadow:"0 0 18px rgba(192,38,211,0.5)" }}>
                  <Sparkles size={16} color="white"/>
                </div>
                <div>
                  <div className="font-bold text-white text-sm leading-tight" style={{ fontFamily:"var(--font-head,'Syne',sans-serif)" }}>CareerCompass</div>
                  <div className="text-purple-400/70 text-[10px]">Map your career. Land your dream role.</div>
                </div>
              </div>

              {/* Headline */}
              <div className="relative z-10 flex-1 flex flex-col justify-center py-4">
                <h1 className="font-extrabold leading-[1.08] mb-3"
                  style={{ fontFamily:"var(--font-head,'Syne',sans-serif)", fontSize:"34px", letterSpacing:"-0.02em", color:"#fff" }}>
                  Your Career,<br/>
                  <span style={{ background:"linear-gradient(90deg,#c084fc,#818cf8,#38bdf8)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
                    Mapped Out.
                  </span>
                </h1>
                <p className="text-purple-300/70 text-[13px] leading-relaxed max-w-[230px] mb-4">
                  AI-powered roadmaps, real-world skills, and personalized guidance to help you achieve career success.
                </p>

                {/* Mountain + badges */}
                <div className="relative w-full">
                  <GlowMountain/>
                  <FloatingBadge icon="✦" label="AI Guidance"     className="bottom-[38%] -left-2"/>
                  <FloatingBadge icon="📈" label="Skill Tracking"  className="top-[28%]  -right-2"/>
                  <FloatingBadge icon="📚" label="Career Roadmaps" className="bottom-[10%] -left-2"/>
                </div>
              </div>

              {/* Testimonial */}
              {/* <div className="relative z-10 rounded-xl p-4 border border-purple-500/15"
                style={{ background:"rgba(255,255,255,0.04)" }}>
                <div className="text-2xl text-purple-600 leading-none mb-2">"</div>
                <p className="text-slate-300/80 text-xs leading-relaxed italic mb-3">
                  "CareerCompass helped me go from clueless to confident. I landed my dream job in 4 months!"
                </p>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                    style={{ background:"linear-gradient(135deg,#7c3aed,#c026d3)" }}>R</div>
                  <div>
                    <div className="text-white text-xs font-semibold">Rohan Mehta</div>
                    <div className="text-purple-400 text-[10px]">ML Engineer at NVIDIA</div>
                  </div>
                </div>
              </div> */}
            </div>
          )}

          {/* ── RIGHT PANEL ── */}
          <div className="flex flex-col justify-center px-6 py-10 sm:px-10"
            style={{ background:"#0f0b1e" }}>

            {/* Mobile logo */}
            {isMobile && (
              <div className="flex items-center gap-2 mb-8">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background:"linear-gradient(135deg,#7c3aed,#c026d3)", boxShadow:"0 0 14px rgba(192,38,211,0.5)" }}>
                  <Sparkles size={15} color="white"/>
                </div>
                <span className="font-bold text-white text-sm" style={{ fontFamily:"var(--font-head,'Syne',sans-serif)" }}>CareerCompass</span>
              </div>
            )}

            {/* Heading */}
            <div className="mb-7">
              <h2 className="font-extrabold text-white mb-1.5"
                style={{ fontFamily:"var(--font-head,'Syne',sans-serif)", fontSize: isMobile ? "24px":"26px" }}>
                Welcome back 👋
              </h2>
              <p className="text-sm text-slate-400">Log in to continue your journey</p>
            </div>

            {/* Google */}
            <button
              className="w-full flex items-center justify-center gap-2.5 py-3 rounded-xl text-sm font-semibold text-slate-200 border border-white/10 mb-5 transition-all duration-200"
              style={{ background:"rgba(255,255,255,0.04)" }}
              onMouseEnter={e=>{e.currentTarget.style.background="rgba(255,255,255,0.08)";e.currentTarget.style.borderColor="rgba(255,255,255,0.18)";}}
              onMouseLeave={e=>{e.currentTarget.style.background="rgba(255,255,255,0.04)";e.currentTarget.style.borderColor="rgba(255,255,255,0.1)";}}>
              <GoogleIcon/> Continue with Google
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 mb-5">
              <div className="flex-1 h-px" style={{ background:"rgba(255,255,255,0.08)" }}/>
              <span className="text-xs text-slate-500">or</span>
              <div className="flex-1 h-px" style={{ background:"rgba(255,255,255,0.08)" }}/>
            </div>

            {/* Email */}
            <div className="mb-4">
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Email address</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 flex pointer-events-none">
                  <Mail size={15}/>
                </span>
                <input type="email" name="email" value={form.email} onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full text-sm text-slate-100 outline-none rounded-xl border border-white/10 transition-all duration-200"
                  style={{ background:"rgba(255,255,255,0.05)", padding:"11px 14px 11px 38px" }}
                  onFocus={e=>{e.target.style.borderColor="rgba(139,92,246,0.6)";e.target.style.background="rgba(139,92,246,0.06)";}}
                  onBlur={e=>{e.target.style.borderColor="rgba(255,255,255,0.1)";e.target.style.background="rgba(255,255,255,0.05)";}}
                />
              </div>
            </div>

            {/* Password */}
            <div className="mb-2">
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Password</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 flex pointer-events-none">
                  <Lock size={15}/>
                </span>
                <input type={showPass?"text":"password"} name="password" value={form.password} onChange={handleChange}
                  placeholder="Enter your password"
                  className="w-full text-sm text-slate-100 outline-none rounded-xl border border-white/10 transition-all duration-200"
                  style={{ background:"rgba(255,255,255,0.05)", padding:"11px 40px 11px 38px" }}
                  onFocus={e=>{e.target.style.borderColor="rgba(139,92,246,0.6)";e.target.style.background="rgba(139,92,246,0.06)";}}
                  onBlur={e=>{e.target.style.borderColor="rgba(255,255,255,0.1)";e.target.style.background="rgba(255,255,255,0.05)";}}
                />
                <button type="button" onClick={()=>setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 flex transition-colors">
                  {showPass?<Eye size={16}/>:<EyeOff size={16}/>}
                </button>
              </div>
            </div>

            {/* Forgot */}
            <div className="flex justify-end mb-6">
              <Link to="/forgot-password"  className="text-xs font-medium text-purple-400 hover:text-purple-300 transition-colors">
                Forgot password?
              </Link>
            </div>

            {/* Submit */}
            <button onClick={handleSubmit} disabled={loading}
              className="w-full py-3.5 rounded-xl text-sm font-bold text-white border-none cursor-pointer transition-all duration-200 mb-4"
              style={{ background:"linear-gradient(135deg,#7c3aed,#9333ea,#c026d3)", boxShadow:"0 0 30px rgba(139,92,246,0.45)", opacity: loading?0.7:1 }}
              onMouseEnter={e=>{if(!loading){e.currentTarget.style.boxShadow="0 0 50px rgba(139,92,246,0.7)";e.currentTarget.style.transform="translateY(-1px)";}}}
              onMouseLeave={e=>{e.currentTarget.style.boxShadow="0 0 30px rgba(139,92,246,0.45)";e.currentTarget.style.transform="translateY(0)";}}>
              {loading?"Signing in…":"Log In"}
            </button>

            {/* Error */}
            {error && (
              <div className="mb-4 px-4 py-2.5 rounded-xl text-xs text-red-400 text-center border border-red-500/25"
                style={{ background:"rgba(239,68,68,0.08)" }}>
                {error}
              </div>
            )}

            {/* Sign up */}
            <p className="text-center text-xs text-slate-500 mb-8">
              Don't have an account?{" "}
              <Link to="/register" className="text-purple-400 font-semibold hover:text-purple-300 transition-colors">Sign up</Link>
            </p>

            {/* Trusted by */}
            {/* <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="flex-1 h-px" style={{ background:"rgba(255,255,255,0.06)" }}/>
                <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-600">Trusted by learners at</span>
                <div className="flex-1 h-px" style={{ background:"rgba(255,255,255,0.06)" }}/>
              </div>
              <div className="flex items-center justify-between gap-2 px-1">
                {["Google","Microsoft","NVIDIA","Amazon"].map(name=>(
                  <span key={name} className="text-slate-600 font-bold text-[11px] sm:text-xs tracking-tight">{name}</span>
                ))}
              </div>
            </div> */}
          </div>

        </div>

        {/* Footer */}
        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1 mt-5">
          {["🔒 Your data is secure and encrypted","Privacy Policy","Terms of Service"].map((t,i)=>(
            <span key={i} className="text-[11px] text-slate-700">{t}</span>
          ))}
        </div>
      </div>
    </div>
  );
}