import { useState } from "react";

export default function TaskSection({ isOwner }) {

  const [tasks, setTasks] = useState([]);

  const [showCreate, setShowCreate] = useState(false);

  const [newQuestion, setNewQuestion] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [answer, setAnswer] = useState(0);
  const [points, setPoints] = useState(5);

  const [questions, setQuestions] = useState([]);

  const [activeTask, setActiveTask] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);

  /* Add Question */

  const addQuestion = () => {

    if (!newQuestion) return;

    const q = {
      question: newQuestion,
      options,
      answer,
      points
    };

    setQuestions([...questions, q]);

    setNewQuestion("");
    setOptions(["", "", "", ""]);
    setAnswer(0);
  };

  /* Create Task */

  const createTask = () => {

    if (questions.length === 0) return;

    setTasks([...tasks, { questions }]);

    setQuestions([]);
    setShowCreate(false);
  };

  /* Select Option */

  const selectOption = (index) => {

    const q = activeTask.questions[currentQuestion];

    if (index === q.answer) {
      setScore(score + q.points);
    }

    if (currentQuestion + 1 < activeTask.questions.length) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      alert(`Task Completed! Score: ${score + (index === q.answer ? q.points : 0)}`);
      setActiveTask(null);
      setCurrentQuestion(0);
      setScore(0);
    }
  };

  return (
    <div className="space-y-6">

      {/* OWNER CREATE TASK */}

      {isOwner && (
        <div className="card-color p-6 rounded-xl border border-gray-700">

          <div className="flex justify-between mb-4">

            <h2 className="font-semibold">Tasks</h2>

            <button
              onClick={() => setShowCreate(!showCreate)}
              className="bg-blue-600 px-4 py-1 rounded"
            >
              Create Task
            </button>

          </div>

          {showCreate && (

            <div className="space-y-4">

              <input
                placeholder="Question"
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                className="w-full bg-transparent border border-gray-600 p-2 rounded"
              />

              {options.map((opt, i) => (
                <input
                  key={i}
                  placeholder={`Option ${i + 1}`}
                  value={opt}
                  onChange={(e) => {
                    const newOpts = [...options];
                    newOpts[i] = e.target.value;
                    setOptions(newOpts);
                  }}
                  className="w-full bg-transparent border border-gray-600 p-2 rounded"
                />
              ))}

              <div className="flex gap-3">

                <select
                  value={answer}
                  onChange={(e) => setAnswer(Number(e.target.value))}
                  className="bg-transparent border border-gray-600 p-2 rounded"
                >
                  <option value={0}>Correct: Option 1</option>
                  <option value={1}>Correct: Option 2</option>
                  <option value={2}>Correct: Option 3</option>
                  <option value={3}>Correct: Option 4</option>
                </select>

                <input
                  type="number"
                  value={points}
                  onChange={(e) => setPoints(Number(e.target.value))}
                  className="w-24 bg-transparent border border-gray-600 p-2 rounded"
                  placeholder="Points"
                />

              </div>

              <button
                onClick={addQuestion}
                className="bg-green-600 px-4 py-1 rounded"
              >
                Add Question
              </button>

              {questions.length > 0 && (
                <button
                  onClick={createTask}
                  className="bg-purple-600 px-4 py-1 rounded"
                >
                  Publish Task
                </button>
              )}

            </div>

          )}

        </div>
      )}

      {/* TODAY TASKS */}

      <div className="card-color p-6 rounded-xl border border-gray-700">

        <h2 className="mb-4 font-semibold">Today's Tasks</h2>

        {tasks.length === 0 && (
          <p className="text-gray-400">No tasks available</p>
        )}

        {tasks.map((task, i) => (
          <button
            key={i}
            onClick={() => setActiveTask(task)}
            className="block w-full text-left p-3 border border-gray-600 rounded mb-2 hover:bg-gray-800"
          >
            Task {i + 1} • {task.questions.length} Questions
          </button>
        ))}

      </div>

      {/* QUESTION PLAYER */}

      {activeTask && (

        <div className="card-color p-6 rounded-xl border border-gray-700">

          <h2 className="mb-4 font-semibold">
            Question {currentQuestion + 1} / {activeTask.questions.length}
          </h2>

          <p className="mb-4">
            {activeTask.questions[currentQuestion].question}
          </p>

          <div className="space-y-3">

            {activeTask.questions[currentQuestion].options.map((opt, i) => (

              <button
                key={i}
                onClick={() => selectOption(i)}
                className="block w-full text-left p-3 border border-gray-600 rounded hover:bg-gray-800"
              >
                {opt}
              </button>

            ))}

          </div>

        </div>

      )}

    </div>
  );
}