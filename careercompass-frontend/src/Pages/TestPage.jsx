import { useState } from "react";

export default function TestPage({ questions = [], onSubmit }) {
  const [answers, setAnswers] = useState({});

  const handleOptionClick = (qIndex, option) => {
    setAnswers({
      ...answers,
      [qIndex]: option,   // store the full option object
      
    });
    
  };

  const handleSubmit = () => {
    if (Object.keys(answers).length !== questions.length) {
      alert("Please answer all questions before submitting.");
      return;
    }
    onSubmit(answers);
  };

  return (
    <div className="min-h-screen py-10 mt-10 px-4">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-xl p-8">

        {questions.map((q, index) => (
          <div key={index} className="mb-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-3">
              {index + 1}. {q.question}
            </h2>

            <div className="grid gap-3">
              {q.options.map((opt, optIndex) => {
                const selected = answers[index]?.text === opt.text;

                return (
                  <button
                    key={optIndex}
                    onClick={() => handleOptionClick(index, opt)}
                    className={`
                      w-full text-left px-4 py-3 rounded-lg border transition
                      ${
                        selected
                          ? "bg-blue-600 text-white border-blue-700"
                          : "bg-gray-50 border-gray-300 hover:bg-gray-200"
                      }
                    `}
                  >
                    {opt.text}
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        <button
          onClick={handleSubmit}
          className="mt-8 w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl text-lg font-semibold shadow-md transition"
        >
          Submit Test
        </button>
      </div>
    </div>
  );
}
