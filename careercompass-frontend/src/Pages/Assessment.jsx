import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import AssessmentLoading from "../components/Loaders/AssessmentLoading";

const Assessment = () => {
  const navigate = useNavigate();
  const { user } = useUser();

  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState([]);

  const loadTest = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        "http://localhost:5000/api/test/generate-test",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userName: user.fullName,
          }),
        }
      );

      const data = await res.json();

      // Store questions temporarily
      setQuestions(data.questions);

      // Navigate AFTER questions are ready
      navigate("/assessment/test", {
        state: { questions: data.questions },
      });
    } catch (err) {
      console.error("Failed to generate test", err);
      alert("Failed to load assessment. Try again.");
      setLoading(false);
    }
  };

  // Show loading screen
  if (loading) {
    return <AssessmentLoading />;
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-semibold text-blue-400">
        Career Assessment
      </h1>

      <p className="text-gray-400">
        This assessment will help us recommend the best career domain for you.
      </p>

      {/* Start Button */}
      <GlowButton
        text="Start Assessment →"
        onClick={loadTest}
      />
    </div>
  );
};

/* Button reused */
const GlowButton = ({ text, onClick }) => (
  <div className="relative inline-block">
    <div
      className="absolute inset-0 rounded-lg blur-xl opacity-60
                 bg-gradient-to-r from-blue-500 to-purple-500
                 pointer-events-none"
    />
    <button
      onClick={onClick}
      className="relative z-10 px-6 py-3 rounded-lg
                 bg-blue-600 hover:bg-blue-700 transition
                 font-medium text-white"
    >
      {text}
    </button>
  </div>
);

export default Assessment;
