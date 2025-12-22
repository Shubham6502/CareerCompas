import { useState } from "react";

const TestPage = ({ questions = [], onSubmit }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});

  const currentQuestion = questions[currentIndex];
  const selected = answers[currentIndex];

  const handleOptionClick = (option) => {
    setAnswers({
      ...answers,
      [currentIndex]: option,
    });
  };

  const handleNext = () => {
    if (!selected) return alert("Please select an option");
    setCurrentIndex((prev) => prev + 1);
  };

  const handleSubmit = () => {
    if (!selected) return alert("Please select an option");
    onSubmit(answers);
  };

  return (
    <div className="space-y-8 max-w-3xl">

      {/* Progress */}
      <p className="text-sm text-gray-400">
        Question {currentIndex + 1} of {questions.length}
      </p>

      {/* Question */}
      <div className="rounded-xl bg-[#0F172A] border border-white/10 p-6">
        <h2 className="text-lg font-medium text-white mb-5">
          {currentQuestion.question}
        </h2>

        <div className="space-y-3">
          {currentQuestion.options.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => handleOptionClick(opt)}
              className={`w-full text-left px-4 py-3 rounded-xl border transition
                ${
                  selected?.text === opt.text
                    ? "bg-blue-600/90 border-blue-500 text-white"
                    : "bg-[#0F172A] border-white/10 text-gray-300 hover:bg-white/5"
                }`}
            >
              {opt.text}
            </button>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-end">
        {currentIndex < questions.length - 1 ? (
          <button
            onClick={handleNext}
            className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white"
          >
            Next →
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            className="px-6 py-3 rounded-lg bg-green-600 hover:bg-green-700 text-white"
          >
            Submit Test →
          </button>
        )}
      </div>
    </div>
  );
};

export default TestPage;
