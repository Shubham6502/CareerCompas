import axios from "axios";
import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";
import { 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Trophy, 
  Clock, 
  ArrowRight, 
  Target,
  Lock,
  Loader2
} from "lucide-react";

function DailyAssessment() {
  const [questions, setQuestions] = useState([]);
  const [score, setScore] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const totalTasks = 3; 
  const [selected, setSelected] = useState(null);
  const [isSubmitted, setSubmitted] = useState(false);
  const { user, isLoaded } = useUser();
  const [domain, setDomain] = useState("");
  const [day, setDay] = useState(0);
  const [assessment, setAssessment] = useState({});
  const [completed, setCompleted] = useState(false);
  const [completedTasks, setCompletedTasks] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!user) {
    return <Navigate to="/" replace />;
  }

  const handleOptionClick = (option) => {
    setSelected(option);
  };

  const handleNext = (correctAnswer) => {
    if (!selected) {
      alert("Please select an option");
      return;
    }

    if (selected === correctAnswer) {
      setScore((prev) => prev + 20);
    }

    setSelected(null);
    setCurrentIndex((prev) => prev + 1);
  };

  const handleSubmit = async () => {
    if (!selected) return alert("Please select an option");
    setIsSubmitting(true);

    let finalScore = score;
    const currentQuestion = questions[currentIndex];
    
    // Evaluate the last question since handleNext wasn't called for it
    if (selected === currentQuestion.answer) {
      finalScore += 20;
      setScore(finalScore);
    }

    try {
      await axios.post("http://localhost:5000/api/progress/assessment", {
        clerkId: user.id,
        day: day,
        score: finalScore
      });

      if (finalScore > 75) {
        setCompleted(true);
      }
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      alert("Failed to submit assessment.");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    axios.get(`http://localhost:5000/api/progress/getProgress/${user.id}`, {
      params: { clerkId: user.id }
    })
    .then((response) => {
      console.log(response.data.completedTasks.tasks.length);
      setDomain(response.data.domain);
      setDay(response.data.currentDay);
      setAssessment(response.data.completedTasks.Assessment);
      setScore(response.data.completedTasks.Assessment.score);
      if (response.data.completedTasks.tasks.length === totalTasks) {
        setCompletedTasks(true);
      }
    });
  }, [isLoaded]);
  console.log(score);
  const canRetake = () => {
    if (!assessment?.lastAttemptAt) return true;

    const last = new Date(assessment.lastAttemptAt);
    const now = new Date();

    const diff = (now - last) / (1000 * 60 * 60);
    
    return diff >= 2;
  };

  useEffect(() => {
    axios.get("http://localhost:5000/api/DailyAssessment/get", {
      params: { day },
    })
    .then((response) => {
      setQuestions(response.data);
    })
    .catch((error) => {
      console.error("Error fetching assessment:", error);
    });
  }, [day]);

  if (score>60) {
    return (
      <div className="flex flex-col items-center justify-center mt-20 p-8 max-w-lg mx-auto bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 rounded-3xl shadow-lg shadow-green-500/10">
        <div className="w-20 h-20 bg-green-100 dark:bg-green-500/20 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 size={40} className="text-green-600 dark:text-green-400" />
        </div>
        <h2 className="text-2xl font-bold text-green-700 dark:text-green-400 mb-2">Assessment Passed</h2>
        <p className="text-center text-green-600 dark:text-green-300 font-medium">You have already successfully passed this assessment. Great job!</p>
      </div>
    );
  }

  if (!canRetake()) {
    return (
      <div className="flex flex-col items-center justify-center mt-20 p-8 max-w-lg mx-auto bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-3xl shadow-lg shadow-red-500/10">
        <div className="w-20 h-20 bg-red-100 dark:bg-red-500/20 rounded-full flex items-center justify-center mb-6">
          <Clock size={40} className="text-red-500 dark:text-red-400" />
        </div>
        <h2 className="text-2xl font-bold text-red-700 dark:text-red-400 mb-2">Cooldown Period</h2>
        <p className="text-center text-red-600 dark:text-red-300 mb-4 font-medium">You did not pass the previous attempt.</p>
        <div className="bg-red-100 dark:bg-red-500/20 px-5 py-3 rounded-2xl border border-red-200 dark:border-red-500/30">
          <p className="text-sm font-semibold text-red-700 dark:text-red-400">
            You can retake this assessment after 2 hours.
          </p>
        </div>
      </div>
    );
  }

  if (!completedTasks) {
    return (
      <div className="flex flex-col items-center justify-center mt-20 p-8 max-w-lg mx-auto bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-3xl shadow-lg shadow-amber-500/10">
        <div className="w-20 h-20 bg-amber-100 dark:bg-amber-500/20 rounded-full flex items-center justify-center mb-6">
          <Lock size={40} className="text-amber-500 dark:text-amber-400" />
        </div>
        <h2 className="text-2xl font-bold text-amber-700 dark:text-amber-400 mb-2">Tasks Incomplete</h2>
        <p className="text-center text-amber-600 dark:text-amber-300 font-medium leading-relaxed">Before taking the test, you need to complete today's recommended tasks.</p>
      </div>
    );
  }

  if (!questions.length) {
    return (
      <div className="flex flex-col flex-1 items-center justify-center min-h-[50vh]">
        <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-4" />
        <p className="text-gray-500 dark:text-gray-400 font-medium">Loading your assessment...</p>
      </div>
    );
  }

  if (isSubmitted) {
    const passed = score > 60;
    return (
      <div className="flex flex-col items-center justify-center mt-12 mb-20 max-w-lg mx-auto w-full px-4">
        <div className={`w-full p-8 md:p-10 rounded-[2rem] border shadow-2xl transition-all duration-500 hover:-translate-y-1 ${
          passed 
            ? "bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border-emerald-200 dark:border-emerald-700/50 shadow-emerald-500/10" 
            : "bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 border-red-200 dark:border-red-700/50 shadow-red-500/10"
        }`}>
          <div className="flex justify-center mb-6">
            <div className={`w-24 h-24 rounded-[2rem] flex items-center justify-center shadow-inner rotate-3 ${
              passed ? "bg-emerald-100 dark:bg-emerald-500/20" : "bg-red-100 dark:bg-red-500/20"
            }`}>
              {passed ? (
                <Trophy size={48} className="text-emerald-500 dark:text-emerald-400" />
              ) : (
                <XCircle size={48} className="text-red-500 dark:text-red-400" />
              )}
            </div>
          </div>
          
          <h2 className="text-3xl font-bold text-center mb-2 text-gray-900 dark:text-white">
            {passed ? "Assessment Passed! 🎉" : "Assessment Failed 😔"}
          </h2>
          
          <div className="flex flex-col items-center mt-8 p-6 bg-white dark:bg-[#0a0a0a]/40 rounded-3xl border border-gray-100 dark:border-gray-800/50 backdrop-blur-sm">
            <span className="text-xs uppercase tracking-[0.2em] font-bold text-gray-400 mb-2">Your Score</span>
            <div className="text-6xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-indigo-500">
              {score}%
            </div>
            
            <p className={`mt-6 text-center text-[15px] font-semibold px-4 py-3 rounded-2xl ${
              passed ? "text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20" : "text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20"
            }`}>
              {passed 
                ? "Excellent work! You have successfully mastered these concepts." 
                : "Review the material and you can retake this assessment in 2 hours."
              }
            </p>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 md:py-16">
      
      {/* ── PROGRESS BAR ── */}
      <div className="mb-10">
        <div className="flex items-end justify-between mb-3 text-sm font-medium">
          <span className="text-gray-500 dark:text-gray-400 uppercase tracking-widest text-[11px] font-bold">
            Question {currentIndex + 1} <span className="text-gray-300 dark:text-gray-600 mx-1">/</span> {questions.length}
          </span>
          <span className="text-blue-500 font-semibold tabular-nums">{Math.round(progress)}%</span>
        </div>
        <div className="w-full h-2.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-700 ease-out" 
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* ── QUESTION CARD ── */}
      <div className="card-color border border-gray-200/60 dark:border-gray-800/60 shadow-xl shadow-gray-200/50 dark:shadow-[0_0_40px_rgba(0,0,0,0.5)] rounded-3xl p-6 sm:p-10 transition-all">
        
        {/* Question text */}
        <h2 className="text-xl sm:text-xl font-semibold text-color  leading-relaxed mb-8">
          {currentQuestion.question}
        </h2>

        {/* Options */}
        <div className="space-y-4">
          {currentQuestion.options.map((option, idx) => {
            const isSelected = selected === option;
            return (
              <button
                key={idx}
                onClick={() => handleOptionClick(option)}
                className={`w-full group relative flex items-center gap-4 text-left p-4 sm:p-5 rounded-2xl border-2 transition-all duration-200
                  ${isSelected
                    ? "bg-blue-50/50 dark:bg-blue-500/5 border-blue-500 ring-4 ring-blue-500/10 shadow-sm"
                    : "bg-color border-gray-200/60 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 hover:bg-gray-50 dark:hover:bg-[#151515]"
                  }`}
              >
                {/* Check box indicator */}
                <div className={`shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors shadow-sm
                  ${isSelected 
                    ? "border-blue-500 bg-blue-500 text-color" 
                    : "border-gray-300 dark:border-gray-700 bg-color text-transparent group-hover:border-gray-400 dark:group-hover:border-gray-600"
                  }`}
                >
                  <CheckCircle2 size={14} className={isSelected ? "block" : "hidden"} />
                </div>
                
                <span className={`text-[15px] sm:text-[16px] font-medium transition-colors leading-snug
                  ${isSelected ? "text-color" : "text-color"}
                `}>
                  {option}
                </span>

                {/* Subtle hover background highlight */}
                {isSelected && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-blue-500/5 dark:to-blue-500/10 rounded-[14px] pointer-events-none" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── FOOTER ACTIONS ── */}
      <div className="mt-8 flex justify-end">
        {currentIndex < questions.length - 1 ? (
          <button
            onClick={() => handleNext(currentQuestion.answer)}
            disabled={!selected}
            className={`flex items-center gap-2 px-8 py-4 rounded-2xl text-[15px] font-semibold transition-all shadow-md active:scale-95
              ${selected 
                ? "bg-gray-900 dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 hover:shadow-lg hover:-translate-y-0.5 cursor-pointer" 
                : "bg-gray-100 dark:bg-gray-800/50 text-gray-400 dark:text-gray-600 cursor-not-allowed border border-gray-200 dark:border-gray-800/50"
              }`}
          >
            Continue <ArrowRight size={18} />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={!selected || isSubmitting}
            className={`flex items-center gap-2 px-8 py-4 rounded-2xl text-[15px] font-semibold transition-all shadow-md active:scale-95
              ${(!selected || isSubmitting)
                ? "bg-gray-100 dark:bg-gray-800/50 text-gray-400 dark:text-gray-600 cursor-not-allowed border border-gray-200 dark:border-gray-800/50"
                : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white hover:shadow-lg hover:shadow-blue-500/25 hover:-translate-y-0.5 cursor-pointer"
              }`}
          >
            {isSubmitting ? (
              <><Loader2 size={18} className="animate-spin" /> Submitting...</>
            ) : (
              <>Submit Test <Target size={18} /></>
            )}
          </button>
        )}
      </div>

    </div>
  );
}

export default DailyAssessment;
