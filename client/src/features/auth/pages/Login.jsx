import { useState } from "react";
import {useAuth} from "../hooks/useAuth";
import {Link} from "react-router-dom";
import { useContext } from "react";
import { useAuthContext } from "../auth.context.jsx";
import {Eye,EyeOff,Check,Sun,Moon,Sparkle} from "lucide-react"
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../../context/ThemeContext.jsx";

const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const GitHubIcon = ({ dark }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill={dark ? "#ffffff" : "#1a1a1a"}>
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
  </svg>
);


const stats = [
  { value: "50K+", label: "Active learners" },
  { value: "200+", label: "Career roadmaps" },
  { value: "98%", label: "Satisfaction rate" },
];

export default function Login() {
  const { loading, user } = useAuthContext();
  const [dark, setDark] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [remember, setRemember] = useState(false);
  const {isDarkMode, setIsDarkMode} = useTheme();

  dark !== isDarkMode && setDark(isDarkMode);
  const [form, setForm] = useState({ email: "", password: "" });
  const {handleLogin,error,setError} = useAuth();
  const navigate=useNavigate();
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if(!form.email || !form.password){
      setError("Please fill in all fields");
      return;
    }

     handleLogin(form.email, form.password);

     if(user){
      navigate("/dashboard");
     }
  };



  const bg = dark ? "bg-gray-950" : "bg-white";
  const panelBg = dark ? "bg-indigo-950" : "bg-indigo-500";
  const cardBg = dark ? "bg-gray-900" : "bg-white";
  const text = dark ? "text-gray-100" : "text-gray-900";
  const subtext = dark ? "text-gray-400" : "text-gray-500";
  const inputBg = dark
    ? "bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-500 focus:border-indigo-500"
    : "bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-indigo-500";
  const dividerColor = dark ? "border-gray-700" : "border-gray-200";
  const oauthBg = dark
    ? "bg-gray-800 border-gray-700 text-gray-100 hover:bg-gray-700"
    : "bg-white border-gray-200 text-gray-800 hover:bg-gray-50";
  const statCard = dark ? "bg-white/10" : "bg-white/20";

  if(loading){
    return (
      <div className={`min-h-screen flex items-center justify-center ${bg} transition-colors duration-300`}>
        <div className="text-gray-500 text-lg">Loading...</div>
      </div>
    );
  }
  return (
    <div className={`min-h-screen flex ${bg} transition-colors duration-300`}>
      {/* Left Panel */}
      <div className={`hidden lg:flex lg:w-[46%] ${panelBg} flex-col justify-between p-10 relative overflow-hidden transition-colors duration-300`}>
        {/* Decorative circles */}
        <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-white opacity-5 pointer-events-none" />
        <div className="absolute bottom-20 -right-20 w-80 h-80 rounded-full bg-white opacity-5 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-white opacity-[0.03] pointer-events-none" />

        {/* Logo */}
        <div className="flex items-center gap-3 z-10">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
            <Sparkle color="white" />
          </div>
          <span className="text-white font-semibold text-lg tracking-tight">CareerCompass</span>
        </div>

        {/* Headline */}
        <div className="z-10 space-y-6">
          <h1 className="text-white text-4xl font-bold leading-tight">
            Welcome<br />back.
          </h1>
          <p className="text-indigo-200 text-base leading-relaxed max-w-xs">
            Pick up right where you left off. Your roadmap is waiting.
          </p>

          {/* Stats cards */}
          <div className="grid grid-cols-3 gap-3 mt-6">
            {stats.map(({ value, label }) => (
              <div key={label} className={`${statCard} backdrop-blur-sm rounded-xl p-4 text-center`}>
                <div className="text-white font-bold text-xl">{value}</div>
                <div className="text-indigo-200 text-xs mt-1">{label}</div>
              </div>
            ))}
          </div>

          {/* Testimonial */}
          <div className={`${statCard} rounded-xl p-5 mt-2`}>
            <p className="text-indigo-100 text-sm leading-relaxed italic">
              "CareerCompass helped me land a role at Google in just 6 months. The structured roadmap kept me on track every day."
            </p>
            <div className="flex items-center gap-2 mt-3">
              <div className="w-7 h-7 rounded-full bg-indigo-300 flex items-center justify-center text-indigo-900 font-bold text-xs">A</div>
              <div>
                <div className="text-white text-xs font-medium">Aarav Mehta</div>
                <div className="text-indigo-300 text-xs">Software Engineer, Google</div>
              </div>
            </div>
          </div>
        </div>

        <p className="text-indigo-300 text-sm z-10">Free forever · No credit card required</p>
      </div>

      {/* Right Panel */}
      <div className={`flex-1 flex items-center justify-center px-6 py-12 ${cardBg} transition-colors duration-300`}>
        <div className="w-full max-w-md">
          {/* Theme toggle */}
          <div className="flex justify-end mb-6">
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`p-2 rounded-lg border transition-colors ${isDarkMode ? "border-gray-700 text-gray-300 hover:bg-gray-800" : "border-gray-200 text-gray-500 hover:bg-gray-100"}`}
              aria-label="Toggle theme"
            >
              {isDarkMode ? <Sun/> : <Moon/>}
            </button>
          </div>

          <div className="mb-7">
            <h2 className={`text-2xl font-bold ${text}`}>Sign in to your account</h2>
            <p className={`mt-1 text-sm ${subtext}`}>
              Don't have an account?{" "}
              <Link to="/register" className="text-indigo-500 font-medium hover:text-indigo-600 transition-colors">Create one</Link>
            </p>
          </div>

          {/* OAuth */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            <button className={`flex items-center justify-center gap-2 py-2.5 rounded-lg border text-sm font-medium transition-colors ${oauthBg}`}>
              <GoogleIcon /> Google
            </button>
            <button className={`flex items-center justify-center gap-2 py-2.5 rounded-lg border text-sm font-medium transition-colors ${oauthBg}`}>
              <GitHubIcon dark={dark} /> GitHub
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-5">
            <div className={`flex-1 border-t ${dividerColor}`} />
            <span className={`text-xs ${subtext}`}>or sign in with email</span>
            <div className={`flex-1 border-t ${dividerColor}`} />
          </div>

          {/* Form */}
          <div className="space-y-4">
            <div>
              <label className={`block text-sm font-medium mb-1.5 ${text}`}>Email</label>
              <input
                type="email" name="email" value={form.email} onChange={handleChange}
                placeholder="you@example.com"
                required
                className={`w-full px-3.5 py-2.5 rounded-lg border text-sm outline-none transition-colors ${inputBg}`}
              />
              
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className={`text-sm font-medium ${text}`}>Password</label>
                <a href="/forgot-password" className="text-indigo-500 text-xs font-medium hover:text-indigo-600 transition-colors">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"} name="password" value={form.password} onChange={handleChange}
                  placeholder="Enter your password"
                  required
                  className={`w-full px-3.5 py-2.5 pr-10 rounded-lg border text-sm outline-none transition-colors ${inputBg}`}
                />
                <button
                  type="button" onClick={() => setShowPass(!showPass)}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 ${subtext} hover:opacity-80`}
                >
                  {showPass ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
              </div>
            </div>

            {/* Remember me */}
            <label className="flex items-center gap-3 cursor-pointer">
              <div
                onClick={() => setRemember(!remember)}
                className={`w-4 h-4 rounded flex items-center justify-center flex-shrink-0 border transition-colors ${
                  remember ? "bg-indigo-500 border-indigo-500" : dark ? "border-gray-600 bg-gray-800" : "border-gray-300 bg-white"
                }`}
              >
                {remember && <Check color="#ffffff"/>}
              </div>
              <span className={`text-sm ${subtext}`}>Remember me for 30 days</span>
            </label>

            <button
            onClick={handleSubmit}
              className="w-full py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg text-sm font-semibold transition-colors duration-200 flex items-center justify-center gap-2 mt-1"
            >
              Sign In
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
              </svg>
            </button>
            {error &&<span
                className="text-sm text-red-500 mt-2 block border border-red-500 rounded px-3 py-2 bg-red-50 text-center"
                style={{ animation: "bounceIn 0.3s ease-out forwards" }}
              >
               {error}
               </span>}
          </div>

          {/* Bottom note */}
          <p className={`text-center text-xs ${subtext} mt-6`}>
            By signing in, you agree to our{" "}
            <a href="#" className="text-indigo-500 hover:underline">Terms</a> and{" "}
            <a href="#" className="text-indigo-500 hover:underline">Privacy Policy</a>.
          </p>
        </div>
      </div>
    </div>
  );
}