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
    // Example scoring / prediction logic
    // (Replace with your real API)
    const predictedDomain = "Software Development";

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
