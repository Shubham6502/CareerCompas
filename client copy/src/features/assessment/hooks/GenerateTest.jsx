import TestPage from "./TestPage";
import { useState } from "react";
import { useUser } from "@clerk/clerk-react";
import predictDomain from "../utils/predictDomain";
import { useNavigate,Navigate } from "react-router-dom";

export default function GenerateTest() {
  const [questions, setQuestions] = useState([]);
  const { user } = useUser();
  const navigate = useNavigate();
  if(!user){
    return <Navigate to="/" replace />;
  }
  const loadTest = async () => {

    const res = await fetch("http://localhost:5000/api/test/generate-test", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userName: user.fullName }),
    });

    const data = await res.json();
    setQuestions(data.questions);
    
  };

  const handleSubmit = (answers) => {

   const answersArray = Object.values(answers);
    const result = predictDomain(answers);
     console.log(result.domain);
    // redirect to result page
    navigate("/result", {
      state: {
        domain: result.domain,
        score: result.score,
        answers: answersArray,

      },
    });
  };

  return (
    <div>
      <div className="flex-grow flex items-center justify-center bg-gradient-to-br from-indigo-100 via-blue-50 to-cyan-100">
        {questions.length === 0 ? (
          <div className="flex flex-col mt-20 justify-around p-10">
            <div className="max-w-2xl mx-auto text-center px-6 py-10">
              <h2 className="text-2xl font-semibold mb-4 text-color">
                Career Prediction Test
              </h2>

              <p className="text-gray-600 leading-relaxed">
                This is a personalized career prediction test designed to guide
                you toward the most suitable career path. You will answer{" "}
                <strong>10 questions</strong>, and based on your responses, you
                will receive a <strong>career recommendation</strong>.
              </p>

              <p className="text-gray-600 mt-3">
                You can retake or change your domain later.
              </p>
            </div>

            <button
              onClick={loadTest}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl text-lg shadow hover:bg-blue-700"
            >
              Start Test
            </button>
          </div>
        ) : (
          
          <TestPage questions={questions} onSubmit={handleSubmit} />
        )}
      </div>
    </div>
  );
}
