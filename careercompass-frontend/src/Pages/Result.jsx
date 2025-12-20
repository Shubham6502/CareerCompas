import { useEffect, useState } from "react";
import { useLocation, Navigate, redirect,useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import axios from "axios";


const ResultPage = () => {
  const location = useLocation();
  const [domain, setDomain] = useState("");
  const {user}=useUser();
  const clerkId=user.id;
  const navigate = useNavigate();



  if (!location.state) {
    return <Navigate to="/" replace />;
  }


  const  predictedDomain=location.state.domain
  const score=location.state.score

  
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

  const handleSave = () => {
    console.log("Final Selected Domain:", domain);
    console.log(clerkId);
    axios.post("http://localhost:5000/api/users/saveLogin",{
      clerkId,
      domain,
    })};
    navigate("/roadmap")

  return (
    <div className="min-h-screen flex justify-center px-4 py-10 bg-gradient-to-br from-indigo-100 via-blue-50 to-cyan-100">
      <div className="max-w-2xl w-full bg-white shadow-xl mt-10 rounded-xl p-8">

        {/* Info */}
        <div className="bg-blue-50 border border-blue-200 text-blue-800 p-5 rounded-lg mb-6">
          <h2 className="text-xl font-semibold mb-2">Important Information</h2>
          <p className="text-sm leading-relaxed">
            This result is generated based on your responses.
            You may change the suggested domain once before saving.
            <span className="font-semibold">
              {" "}After saving, it cannot be changed.
            </span>
          </p>
        </div>

        <h1 className="text-2xl font-bold text-center mb-4">
          Your Career Result
        </h1>

        <p className="mt-4 text-lg text-gray-700 font-medium text-center">
          Recommended Domain
        </p>

        {/* Domain Dropdown */}
        <div className="flex justify-center mt-3">
          <select
            className="p-3 border border-gray-300 rounded-lg w-64"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
          >
            {domains.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        {/* Score */}
        {/* <p className="mt-4 text-gray-600 text-center">
          Test Score: <span className="font-semibold">{score}</span>
        </p> */}

        {/* Save */}
        <button
          className="mt-8 bg-blue-600 hover:bg-blue-700 text-white w-full py-3 rounded-xl text-lg font-semibold"
          onClick={handleSave}
        >
          Save Preference
        </button>
      </div>
    </div>
  );
};

export default ResultPage;
