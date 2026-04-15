import { useEffect, useState } from "react";
import { useLocation, Navigate, useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import axios from "axios";

const ResultPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useUser();
 if(!user){
      return <Navigate to="/" replace />;
  }
  if (!location.state?.domain) {
    return <Navigate to="/dashboard" replace />;
  }
 
  const clerkId = user?.id;
  const [domain, setDomain] = useState("");

  // const predictedDomain = location.state.domain;
  const predictedDomain ="Software Development";

  useEffect(() => {
    setDomain(predictedDomain);
  }, [predictedDomain]);

  const domains = [
    "Software Development",
    "AI/ML",
    "Data Science",
    "Web Development",
    "Cybersecurity",
    "Cloud",
    "DevOps",
    "UI/UX",
    "Business Analyst",
  ];

  const handleSave = async () => {
    try {
      // await axios.post("http://localhost:5000/api/users/saveLogin", {
      //   clerkId,
      //   domain,
      // });

      await axios.post("https://careercompas.onrender.com/api/progress/initProgress", {
        clerkId,
        domain,
      });

      navigate("/dashboard", { replace: true });
    } catch (err) {
      alert(err);
    }
  };

  return (
    <div className="max-w-xl space-y-6 flex flex-col px-6 py-8 mx-auto">

      <div className="rounded-lg bg-blue-500/10 border border-blue-500/20 p-4 text-blue-300 text-sm">
        You can change the suggested domain once before saving.(currently only Software Development is enabled)
      </div>

      <h1 className="text-2xl font-semibold text-white text-center">
        Your Career Recommendation
      </h1>

      <p className="text-center text-gray-400">
        Recommended Domain
      </p>

      <select
        value={domain}
        onChange={(e) => setDomain(e.target.value)}
        className="w-full p-3 rounded-lg bg-[#0F172A] border border-white/10 text-white"
      >
        {domains.map((d) => (
          <option key={d} value={d}>
            {d}
          </option>
        ))}
      </select>

      <button
        onClick={handleSave}
        className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium"
      >
        Save & Continue →
      </button>
    </div>
  );
};

export default ResultPage;
