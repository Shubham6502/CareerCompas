import { useLocation, Navigate, useNavigate } from "react-router-dom";
import TestPage from "./TestPage";

const AssessmentTest = () => {
  const location = useLocation();
  const navigate = useNavigate();

  if (!location.state?.questions) {
    return <Navigate to="/assessment" replace />;
  }

  const questions = location.state.questions;

  const handleSubmit = async (answers) => {
    const scoreMap = {};

  Object.values(answers).forEach((ans) => {
    const domain = ans.domain;

    if (domain) {
      scoreMap[domain] = (scoreMap[domain] || 0) + 1;
    }
  });

  let maxScore = 0;
  let selectedDomain = null;

  for (const domain in scoreMap) {
    if (scoreMap[domain] > maxScore) {
      maxScore = scoreMap[domain];
      selectedDomain = domain;
    }
  }
    const predictedDomain = selectedDomain || "Software Development";

    navigate("/assessment/result", {
      state: {
        domain: predictedDomain,
      },
    });
  };

  return (
    <TestPage
      questions={questions}
      onSubmit={handleSubmit}
    />
  );
};

export default AssessmentTest;
