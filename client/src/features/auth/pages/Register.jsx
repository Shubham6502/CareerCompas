import { useState, useContext } from "react";
import { useAuth } from "../hooks/useAuth.js";
import { Link } from "react-router-dom";
import { useAuthContext } from "../auth.context.jsx";
import { useNavigate } from "react-router-dom";

const SunIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" />
    <line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" />
    <line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
);

const MoonIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

const EyeIcon = ({ open }) =>
  open ? (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );

const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24">
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </svg>
);

const GitHubIcon = ({ dark }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill={dark ? "#ffffff" : "#1a1a1a"}
  >
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
  </svg>
);

const CheckIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="white"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const StarIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="white" stroke="none">
    <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
  </svg>
);

const features = [
  "Personalized AI-powered career roadmaps",
  "Daily structured tasks across DSA, Dev & CS",
  "XP, streaks, and achievement badges",
  "Community roadmaps and leaderboards",
];

export default function Register() {
  const { loading, error, user } = useAuthContext();
  const { handleRegister } = useAuth();
  const [dark, setDark] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [validate, setValidate] = useState(null);
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

 

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!agreed) {
      setValidate("You must agree to the terms to register.");
      return;
    }
    if (form.password.length < 8) {
      setValidate("Password must be at least 8 characters long.");
      return;
    }
    try {
      setValidate(null);
      await handleRegister(
        form.email,
        form.password,
        `${form.firstName} ${form.lastName}`,
      );
       
      
      // Redirect or show success message
    } catch (error) {
      // Handle error
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

  if (loading) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${bg} transition-colors duration-300`}
      >
        <div className="text-gray-500 text-lg">Loading...</div>
      </div>
    );
  }
  return (
    <div className={`min-h-screen flex ${bg} transition-colors duration-300`}>
      {/* Left Panel */}
      <div
        className={`hidden lg:flex lg:w-[46%] ${panelBg} flex-col justify-between p-10 relative overflow-hidden transition-colors duration-300`}
      >
        {/* Decorative circles */}
        <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-white opacity-5 pointer-events-none" />
        <div className="absolute bottom-20 -right-20 w-80 h-80 rounded-full bg-white opacity-5 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-white opacity-[0.03] pointer-events-none" />

        {/* Logo */}
        <div className="flex items-center gap-3 z-10">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
            <StarIcon />
          </div>
          <span className="text-white font-semibold text-lg tracking-tight">
            CareerCompass
          </span>
        </div>

        {/* Headline */}
        <div className="z-10 space-y-6">
          <h1 className="text-white text-4xl font-bold leading-tight">
            Start your
            <br />
            career journey.
          </h1>
          <p className="text-indigo-200 text-base leading-relaxed max-w-xs">
            Join thousands of learners building their path to top tech
            companies.
          </p>
          <ul className="space-y-3 mt-4">
            {features.map((f) => (
              <li key={f} className="flex items-center gap-3">
                <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                  <CheckIcon />
                </span>
                <span className="text-indigo-100 text-sm">{f}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="text-indigo-300 text-sm z-10">
          Free forever · No credit card required
        </p>
      </div>

      {/* Right Panel */}
      <div
        className={`flex-1 flex items-center justify-center px-6 py-12 ${cardBg} transition-colors duration-300`}
      >
        <div className="w-full max-w-md">
          {/* Theme toggle */}
          <div className="flex justify-end mb-6">
            <button
              onClick={() => setDark(!dark)}
              className={`p-2 rounded-lg border transition-colors ${dark ? "border-gray-700 text-gray-300 hover:bg-gray-800" : "border-gray-200 text-gray-500 hover:bg-gray-100"}`}
              aria-label="Toggle theme"
            >
              {dark ? <SunIcon /> : <MoonIcon />}
            </button>
          </div>

          <div className="mb-7">
            <h2 className={`text-2xl font-bold ${text}`}>
              Create your account
            </h2>
            <p className={`mt-1 text-sm ${subtext}`}>
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-indigo-500 font-medium hover:text-indigo-600 transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>

          {/* OAuth */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            <button
              className={`flex items-center justify-center gap-2 py-2.5 rounded-lg border text-sm font-medium transition-colors ${oauthBg}`}
            >
              <GoogleIcon /> Google
            </button>
            <button
              className={`flex items-center justify-center gap-2 py-2.5 rounded-lg border text-sm font-medium transition-colors ${oauthBg}`}
            >
              <GitHubIcon dark={dark} /> GitHub
            </button>
          </div>

          {/* Divider */}
          <div className={`flex items-center gap-3 mb-5`}>
            <div className={`flex-1 border-t ${dividerColor}`} />
            <span className={`text-xs ${subtext}`}>or sign up with email</span>
            <div className={`flex-1 border-t ${dividerColor}`} />
          </div>

          {/* Form */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={`block text-sm font-medium mb-1.5 ${text}`}>
                  First name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  placeholder="John"
                  className={`w-full px-3.5 py-2.5 rounded-lg border text-sm outline-none transition-colors ${inputBg}`}
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-1.5 ${text}`}>
                  Last name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  placeholder="Doe"
                  className={`w-full px-3.5 py-2.5 rounded-lg border text-sm outline-none transition-colors ${inputBg}`}
                />
              </div>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-1.5 ${text}`}>
                Email
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className={`w-full px-3.5 py-2.5 rounded-lg border text-sm outline-none transition-colors ${inputBg}`}
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-1.5 ${text}`}>
                Password
              </label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Min. 8 characters"
                  className={`w-full px-3.5 py-2.5 pr-10 rounded-lg border text-sm outline-none transition-colors ${inputBg}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 ${subtext} hover:opacity-80`}
                >
                  <EyeIcon open={showPass} />
                </button>
              </div>
            </div>

            {/* Terms */}
            <label className="flex items-start gap-3 cursor-pointer">
              <div
                onClick={() => setAgreed(!agreed)}
                className={`mt-0.5 w-4 h-4 rounded flex items-center justify-center flex-shrink-0 border transition-colors ${
                  agreed
                    ? "bg-indigo-500 border-indigo-500"
                    : dark
                      ? "border-gray-600 bg-gray-800"
                      : "border-gray-300 bg-white"
                }`}
              >
                {agreed && <CheckIcon />}
              </div>
              <span className={`text-sm ${subtext}`}>
                I agree to the{" "}
                <a href="#" className="text-indigo-500 hover:underline">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="text-indigo-500 hover:underline">
                  Privacy Policy
                </a>
              </span>
            </label>

            <button
              onClick={handleSubmit}
              className="w-full py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg text-sm font-semibold transition-colors duration-200 flex items-center justify-center gap-2 mt-1"
            >
              Create Account
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
            {(validate || error) && (
              <span
                className="text-sm text-red-500 mt-2 block border border-red-500 rounded px-3 py-2 bg-red-50 text-center"
                style={{ animation: "bounceIn 0.3s ease-out forwards" }}
              >
                {error}
                {validate}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
