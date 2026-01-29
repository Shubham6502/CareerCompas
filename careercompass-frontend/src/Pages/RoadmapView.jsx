import React, { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import axios from "axios";
import { useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";

const ThreeMonthPrep = () => {
  const  [roadmapData,setRoadmapData]=useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedWeek, setSelectedWeek] = useState(null);
 if(!user){
      return <Navigate to="/" replace />;
  }
  useEffect(()=>{
    axios
    .get("http://localhost:5000/api/roadmap/Software-Engineer")
    .then((res)=>{ setRoadmapData(res.data)})
    .catch((err)=>{console.log(err)})
  },[])

  console.log(roadmapData);
  if(!roadmapData) return <p>Loading.....</p>
  return (
    <section className="min-h-screen bg-gradient-to-br from-indigo-100 via-blue-50 to-cyan-100 px-6 py-20">
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-14"
        >
          <h1 className="text-4xl font-extrabold text-gray-800">
            3-Month <span className="text-blue-600">Preparation Kit</span>
          </h1>
          <p className="text-gray-600 mt-3">
            Structured, AI-guided roadmap to make you placement-ready
          </p>
        </motion.div>

        {/* MONTH VIEW */}
        {!selectedMonth && (
          <div className="flex flex-col gap-8">
            {roadmapData.months.map((m, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05 }}
                onClick={() => setSelectedMonth(m)}
                className="bg-white cursor-pointer shadow-lg rounded-2xl p-6 hover:shadow-2xl transition"
              >
                <h2 className="text-xl font-bold text-blue-600 mb-2">
                  {m.month}
                </h2>
                <h3 className="text-gray-800 font-semibold">{m.title}</h3>
                <p className="text-gray-600 text-sm mt-2">{m.desc}</p>
              </motion.div>
            ))}
          </div>
        )}

        {/* WEEK VIEW */}
        {selectedMonth && !selectedWeek && (
          <div>
            <button
              onClick={() => setSelectedMonth(null)}
              className="mb-6 text-blue-600 font-medium"
            >
              ← Back
            </button>

            <h2 className="text-3xl font-bold text-gray-800 mb-8">
              {selectedMonth.month}
            </h2>

            <div className="flex flex-col gap-6">
              {selectedMonth.weeks.map((w, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.03 }}
                  onClick={() => setSelectedWeek(w)}
                  className="bg-white cursor-pointer shadow-md rounded-xl p-5 hover:shadow-lg"
                >
                  <h3 className="text-lg font-semibold text-gray-800">
                    {w.week}
                  </h3>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* DAY VIEW */}
        {selectedWeek && (
          <div>
            <button
              onClick={() => setSelectedWeek(null)}
              className="mb-6 text-blue-600 font-medium"
            >
              ← Back
            </button>

            <h2 className="text-3xl font-bold text-gray-800 mb-8">
              {selectedWeek.week}
            </h2>

            <div className="space-y-5">
              {selectedWeek.days.map((d, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.02 }}
                  className="bg-white shadow-md rounded-xl p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <h4 className="font-semibold text-gray-800">{d.day}</h4>
                    <p className="text-gray-600 text-sm">{d.task[0]}</p>
                     <p className="text-gray-600 text-sm">{d.task[1]}</p>
                  </div>

                  <div className="flex items-center gap-4 mt-4 sm:mt-0">
                    <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
                      Go to Task
                    </button>
                    {d.done && <CheckCircle className="text-green-500" />}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ThreeMonthPrep;
