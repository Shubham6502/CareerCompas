import Card from "./Card";
import SectionLabel from "./SectionLabel.jsx";
import AddExperienceModal from "../modals/AddExperienceModal.jsx";
import EditExperienceModal from "../modals/EditExperienceModal.jsx";
import {Pencil} from 'lucide-react';
import { useState } from "react";


export default function ExperiencePortfolio({ experiences,onSave,onEdit,onDelete }) {
  const[showModal,setShowModal]=useState(false);
  const [showEditModal,setShowEditModal]=useState(false);
  const [selectedExperience,setSelectedExperience]=useState(null);
  const handleClick=()=>{

    setShowModal(true);
  }
  const handleOnsave=(newExperience)=>{
    console.log("New experience to save:", newExperience);
    onSave(newExperience);
    setShowModal(false);
  };
 
  const handleEdit=(experience,idx)=>{
    setSelectedExperience({experience,idx});
    setShowEditModal(true);

  }
  experiences.sort((a, b) => {
    const endA = a.end === "present" ? new Date() : new Date(a.end);
    const endB = b.end === "present" ? new Date() : new Date(b.end);
    return endB - endA;
  });
 
  return (
    <>
    <Card>
      <div className="flex items-center justify-between mb-4">
      <SectionLabel>Experience Portfolio</SectionLabel>
     <span onClick={handleClick}><Pencil className="w-8 h-8 border rounded-full p-2 cursor-pointer"/></span> 
      
      </div>
      <div className="space-y-5">
        {experiences.map((exp, idx) => (
          <div key={exp.role} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div
                className="w-2.5 h-2.5 rounded-full mt-1 shrink-0"
                style={{
                  backgroundColor: exp.isPresent ? "#3fb950" : "#8b949e",
                  boxShadow: exp.isPresent ? "0 0 6px #3fb950" : "none",
                }}
              />
              <div
                className="w-px flex-1 mt-1"
                style={{ backgroundColor: "rgba(139,148,158,0.2)" }}
              />
            </div>
            <div className="pb-2">
              <p
                className="text-sm font-semibold"
                style={{ color: "var(--text-color)" }}
              >
                {exp.role}
              </p>
              <p
                className="text-[10px] tracking-widest mb-1"
                style={{ color: "var(--subText-color)" }}
              >
                {exp.start} - {exp.end}
              </p>
              <p className="text-xs" style={{ color: "var(--subText-color)" }}>
                {exp.description}
              </p>
               <div className="flex gap-3 ">
               <button onClick={() => handleEdit(exp,idx)} className=" mt-2 text-xs border px-2 py-1 rounded-full " style={{ color: "var(--text-color)", borderColor: "var(--subText-color)" }}>
                Edit
              </button>
               <button onClick={() => onDelete(exp, idx)} className=" mt-2 text-xs border px-2 py-1 rounded-full bg-red-400/30 text-white " style={{ color: "var(--text-color)", borderColor: "var(--subText-color)" }}>
                Delete
              </button>
              </div>
            </div>

          </div>
        ))}
      </div>
    </Card>
    {showModal && <AddExperienceModal onClose={() => setShowModal(false)} onSave={handleOnsave} />}
      {showEditModal && <EditExperienceModal experience={selectedExperience} onClose={() => setShowEditModal(false)} onEdit={onEdit} />}
    </>
  );
}