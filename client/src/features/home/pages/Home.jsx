import Navbar from "../components/Navbar.jsx";
import Hero from "../components/Hero.jsx";
import Stats from "../components/Stat.jsx";
import Features from "../components/Features.jsx";
import Domains from "../components/Domains.jsx";
import HowItWorks from "../components/HowItWorks.jsx";
import CTA from "../components/CTA.jsx";
import Footer from "../components/Footer.jsx";
import { useAuthContext } from "../../auth/auth.context.jsx";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  if (user) {
    navigate("/dashboard");
  }

  return (
    <div style={{ minHeight: "100vh", background: "#0a0814", position: "relative" }}>

      {/* ── FIXED AMBIENT GLOW LAYER ── stays behind everything as you scroll ── */}
      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
          overflow: "hidden",
        }}
      >
        {/* Purple blob — top right */}
        <div style={{
          position: "absolute",
          top: "-10%",
          right: "-15%",
          width: "70vw",
          height: "70vw",
          maxWidth: "780px",
          maxHeight: "780px",
          borderRadius: "50%",
          background: "radial-gradient(ellipse at center, rgba(139,92,246,0.35) 0%, rgba(109,40,217,0.18) 35%, transparent 70%)",
          filter: "blur(40px)",
        }} />

        {/* Teal / green blob — bottom left */}
        <div style={{
          position: "absolute",
          bottom: "-10%",
          left: "-15%",
          width: "60vw",
          height: "60vw",
          maxWidth: "680px",
          maxHeight: "680px",
          borderRadius: "50%",
          background: "radial-gradient(ellipse at center, rgba(20,184,166,0.22) 0%, rgba(16,185,129,0.10) 40%, transparent 70%)",
          filter: "blur(50px)",
        }} />

        {/* Subtle centre deep-purple wash so mid-page glows too */}
        <div style={{
          position: "absolute",
          top: "30%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "80vw",
          height: "60vw",
          maxWidth: "900px",
          maxHeight: "600px",
          borderRadius: "50%",
          background: "radial-gradient(ellipse at center, rgba(88,28,235,0.08) 0%, transparent 65%)",
          filter: "blur(60px)",
        }} />

        {/* Grid texture on top of the glow */}
        <div style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(124,58,237,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(124,58,237,0.04) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }} />
      </div>

      {/* ── PAGE CONTENT — scrolls over the fixed glow ── */}
      <div style={{ position: "relative", zIndex: 1 }}>
        <Navbar />
        <Hero />
        <Stats />
        <Features />
        <Domains />
        <HowItWorks />
        <CTA />
        <Footer />
      </div>
    </div>
  );
}