import axios from "axios";
import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";

function DailyAssessment() {
  const [questions, setQuestions] = useState([]);
  const [score, setScore] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
 const totalTasks=3; 
  const [selected, setSelected] = useState(null);
  const [isSubmitted,setSubmitted]=useState(false);
  const {user,isLoaded}=useUser();
  const [domain,setDomain]=useState("");
  const [day,setDay]=useState(0);
  const [assessment,setAssessment]=useState({})
  const [completed,setCompleted]=useState(false);
 const [completedTasks, setCompletedTasks] = useState(false);

  
  if(!user){
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
    const handleSubmit = () => {
    if (!selected) return alert("Please select an option");

      axios.post("http://localhost:5000/api/progress/assessment",{
        clerkId:user.id,
        day:day,
        score:score
    })
    if(score>75){
      setCompleted(true);
    }
    setSubmitted(true);
   
  
    
  }
  useEffect(()=>{
    axios.get(`http://localhost:5000/api/progress/getProgress/${user.id}`,{
        params:{clerkId:user.id}
    })
    .then((response)=>{
        console.log(response.data.completedTasks.tasks.length);
        setDomain(response.data.domain);
        setDay(response.data.currentDay);
        setAssessment(response.data.completedTasks.Assessment)
        if(response.data.completedTasks.tasks.length===totalTasks){
            setCompletedTasks(true)
            
        }
        console.log(assessment);
        console.log(day)
    })
  },[isLoaded])

  const canRetake = () => {
  if (!assessment?.lastAttemptAt) return true;

  const last = new Date(assessment.lastAttemptAt);
  const now = new Date();

  const diff = (now - last) / (1000 * 60 * 60);
  
  return diff >= 2;
};

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/DailyAssessment/get", {
        params: { day },
      })
      .then((response) => {
        setQuestions(response.data.questions);
      })
      .catch((error) => {
        console.error("Error fetching assessment:", error);
      });
  }, [day]);
 
  

  

  if(completed){
    return(<div className="text-color text-center mt-10">You Passed This Assessment</div>);
  }
  if(!canRetake()){
    return(<div className="text-color text-center mt-10">You Failed.. <span>You can Retake this Assessment After 2 Hours </span></div>);
  }

    if(!completedTasks){
        return(<div className="text-color text-center mt-10">Before Taking Test You Need To Complete Todays Tasks</div>);
    }
 
  if (!questions.length) {
    return (
      <div className="text-color text-center mt-10">Loading assessment...</div>
    );
  }

if (isSubmitted) {
  return (
    <div className="flex flex-col items-center justify-center mt-20 text-color">
      <h2 className="text-3xl font-semibold mb-4">Assessment Completed 🎉</h2>
      <p className="text-xl">
        Your Score: <span className="text-blue-400">{score}</span>
      </p>

      {score>75
      ?<div>Great You Passed The Assessment</div>
      :<div> You Failed!.....<p>You can Retake This Assessment After 2 Hr</p></div>
    }
    </div>
  );
}
  const currentQuestion = questions[currentIndex];

  return (
    <div className="space-y-8 max-w-3xl lg:my-20 mx-auto">
      <p className="subText-color mb-3">
        Question {currentIndex + 1} of {questions.length}
      </p>

      <div className="rounded-xl card-color shadow-xl p-6">
        <h2 className="text-lg font-medium text-color mb-5">
          {currentQuestion.question}
        </h2>

        <div className="space-y-3">
          {currentQuestion.options.map(({ option }, idx) => (
            <button
              key={idx}
              onClick={() => handleOptionClick(option)}
              className={`w-full text-left px-4 py-3 rounded-xl border transition
                ${
                  selected === option
                    ? "bg-blue-600/90 border-blue-500 text-color"
                    : "subcard-color border-white/10 subText-color hover:bg-white/5"
                }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
       <div className="flex justify-end">
        {currentIndex < questions.length - 1 ? (
          <button
            onClick={()=>handleNext(currentQuestion.answer)}
            className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-color"
          >
            Next →
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            className="px-6 py-3 rounded-lg bg-green-600 hover:bg-green-700 text-color"
          >
            Submit Test →
          </button>
        )}
      </div>
    </div>
  );
}

export default DailyAssessment;
