import { useState } from "react";

const ResultPage = ({ result, predictedDomain, onSave }) => {
  const [domain, setDomain] = useState(predictedDomain);

  const domains = [
    "Software Development",
    "AI/ML",
    "Data Science",
    "Web Development",
    "Cybersecurity",
    "Cloud",
    "DevOps",
    "UI/UX",
    "Business Analyst"
  ];

  return (
    <div className="min-h-screen flex justify-center px-4 py-10  bg-gradient-to-br from-indigo-100 via-blue-50 to-cyan-100">
      <div className="max-w-2xl w-full bg-white shadow-xl mt-10 rounded-xl p-8">

        {/* --- Information Section --- */}
        <div className="bg-blue-50 border border-blue-200 text-blue-800 p-5 rounded-lg text-left mb-6">
          <h2 className="text-xl font-semibold mb-2">Important Information</h2>
          <p className="text-sm leading-relaxed">
            This result is generated based on your responses to the career prediction test.
            If you are not satisfied with the suggested domain, you may manually change it below.
            <span className="font-semibold"> Once you submit your preference, you will not be able to modify it later.</span>
            You will receive a complete roadmap and study resources based on the selected domain.
          </p>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-center mb-4">Your Career Result</h1>

        {/* Recommended Domain */}
        <p className="mt-4 text-lg text-gray-700 font-medium text-center">
          Recommended Domain:
        </p>

        {/* Domain Select */}
        <div className="flex justify-center mt-3">
          <select
            className="p-3 border border-gray-300 rounded-lg shadow-sm w-64 bg-white"
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

        {/* Score (if available) */}
        {result?.score && (
          <p className="mt-4 text-gray-600 text-center">
            Test Score: <span className="font-semibold">{result.score}</span>
          </p>
        )}

        {/* Submit Button */}
        <button
          className="mt-8 bg-blue-600 hover:bg-blue-700 text-white w-full py-3 rounded-xl text-lg font-semibold shadow-md transition"
          onClick={() => onSave(domain)}
        >
          Save Preference
        </button>
      </div>
    </div>
  );
};

export default ResultPage;
